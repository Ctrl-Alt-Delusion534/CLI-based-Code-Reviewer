import hashlib
import sqlite3
DB_PATH = "scanner_cache.db"

def init_cache():
    """Create the cache database and table if they don't exist.
    """
    conn=sqlite3.connect(DB_PATH)
    cursor=conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS file_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filepath TEXT UNIQUE,
            sha256 TEXT
        )
    ''')
    conn.commit()
    conn.close()

def get_file_hash(filepath:str)->str:
    """Read file raw bytes and compute its SHA256 hash."""
    hasher=hashlib.sha256()
    with open(filepath,'rb') as f:
        buf=f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def is_file_modified(filepath:str,current_hash: str)->bool:
    """Will check the hash generated with the data in the cache."""
    conn=sqlite3.connect(DB_PATH)
    cursor=conn.cursor()
    cursor.execute("SELECT sha256 FROM file_cache WHERE filepath = ?", (filepath,))
    row=cursor.fetchone()
    conn.close()
    if row and row[0]==current_hash:
        return False
    return True

def update_cache(filepath:str,current_hash:str):
    """Update the DB"""
    conn=sqlite3.connect(DB_PATH)
    cursor=conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO file_cache (filepath, sha256) VALUES (?, ?)", (filepath, current_hash))
    conn.commit()
    conn.close()