import psycopg2
from app.config import settings

class VectorStore:
    def __init__(self):
        self.enabled = False
        if settings.database_url:
            try:
                self.conn = psycopg2.connect(settings.database_url)
                self.enabled = True
            except Exception as e:
                print(f"VectorStore Database connection failed: {e}")
                self.conn = None
        else:
            self.conn = None

    def insert_chunk(self, doc_id: str, content: str, embedding: list[float], index: int):
        if not self.enabled or not self.conn:
            return
        with self.conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "chunkIndex")
                VALUES (cuid(), %s, %s, %s, %s)
                """,
                (doc_id, content, embedding, index)
            )
            self.conn.commit()

    def similarity_search(self, query_embedding: list[float], user_id: str, limit: int = 5):
        if not self.enabled or not self.conn:
            return []
        with self.conn.cursor() as cur:
            cur.execute(
                """
                SELECT c.content, c."documentId", (c.embedding <=> %s::vector) as distance
                FROM "DocumentChunk" c
                INNER JOIN "Document" d ON c."documentId" = d.id
                WHERE d."userId" = %s
                ORDER BY distance ASC
                LIMIT %s;
                """,
                (query_embedding, user_id, limit)
            )
            return cur.fetchall()

    def search_articles(self, query_embedding: list[float], limit: int = 10):
        if not self.enabled or not self.conn:
            return []
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, title, (embedding <=> %s::vector) as distance
                    FROM "Articles"
                    WHERE embedding IS NOT NULL
                    ORDER BY distance ASC
                    LIMIT %s;
                    """,
                    (query_embedding, limit)
                )
                return cur.fetchall()
        except Exception as e:
            print(f"Failed to query semantic search: {e}")
            if self.conn:
                self.conn.rollback()
            return []
