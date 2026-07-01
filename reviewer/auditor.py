from google import genai
from reviewer.cache import get_file_hash, is_file_modified, update_cache
from reviewer.ast_parser import analyze_ast

def process_file(filepath: str, client: genai.Client) -> dict:
    """auditing a single file: check cache, look into AST, and run LLM check."""
    try:
        file_hash = get_file_hash(filepath)
        
        #skipping unchanged file
        #api call saved
        if not is_file_modified(filepath, file_hash):
            return None
        
        ast_issues, code_content = analyze_ast(filepath)
        
        #the alerts received from the AST parsing, putting them into the prompt
        prompt = f"""
        Perform a strict code audit on the following source file.
        AST Static Analysis Alerts: {ast_issues if ast_issues else "None"}
        
        CODE:
        {code_content}
        
        Always structure your response using this exact clean Markdown format, without any emojis or symbols:

        ### Bad Code
        ```[language]
        [original bad code snippet]
        ```

        ### Issues
        - [First issue description, explaining the bug/flaw/bottleneck]
        - [Second issue description, explaining another bug/flaw]

        ### Recommended Fix
        ```[language]
        [refactored, corrected, and clean code snippet]
        ```

        ### Improvements
        - [Explain how the fix resolves the first issue]
        - [Explain how the fix resolves the second issue]
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        #update the db
        update_cache(filepath, file_hash)
        
        return {
            "file": filepath, 
            "issues": ast_issues, 
            "llm_feedback": response.text.strip()
        }
    except Exception as e:
        return {"file": filepath, "error": str(e)}