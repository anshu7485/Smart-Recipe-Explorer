"""
Database connection and operations module.
Handles MongoDB connection and provides database instance.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    """MongoDB database manager."""
    
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Establish connection to MongoDB."""
        try:
            cls.client = AsyncIOMotorClient(settings.mongodb_url)
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info(f"Successfully connected to MongoDB at {settings.mongodb_url}")
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection."""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")
    
    @classmethod
    async def get_database(cls):
        """Get database instance. Auto-connects if not connected."""
        if not cls.client:
            logger.info("Database not connected, connecting now...")
            try:
                await cls.connect_db()
            except Exception as e:
                logger.error(f"Failed to connect to database: {e}")
                # Return None or raise based on criticality
                # For serverless, we'll try to connect on each request
                cls.client = AsyncIOMotorClient(settings.mongodb_url)
        return cls.client[settings.database_name]


async def get_db():
    """Dependency to get database instance."""
    return await Database.get_database()
