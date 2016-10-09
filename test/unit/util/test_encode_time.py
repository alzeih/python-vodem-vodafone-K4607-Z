import datetime
import unittest

from vodem.util import encode_time


class TestEncodeTime(unittest.TestCase):

    def setUp(self):
        self.current = datetime.datetime.now()

    def test_encode(self):
        result = encode_time(self.current)
