import time

import structlog

from app.core.config import get_settings
from app.observability.logging import configure_logging


def main() -> None:
    settings = get_settings()
    configure_logging(settings.app_env)
    logger = structlog.get_logger(__name__)
    logger.info("worker.started", app=settings.app_name, environment=settings.app_env)

    while True:
        logger.info("worker.idle", message="Background queue integration begins in Milestone 3")
        time.sleep(60)


if __name__ == "__main__":
    main()

