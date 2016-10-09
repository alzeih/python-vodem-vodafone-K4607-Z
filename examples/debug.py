""" An example of how to setup debugging logging """
import logging

LEVEL = logging.DEBUG

logging.getLogger("vodem.connection").setLevel(LEVEL)
logging.getLogger("vodem.api").setLevel(LEVEL)
logging.getLogger("vodem.simple").setLevel(LEVEL)
logging.getLogger("vodem.util").setLevel(LEVEL)
