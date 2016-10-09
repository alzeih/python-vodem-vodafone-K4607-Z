import unittest

from vodem.util import decode_time


class TestDecodeTime(unittest.TestCase):

    def setUp(self):
        self.time_str = '70,01,01,00,00,00,+0'

    def test_decode_time(self):
        result = decode_time(self.time_str)
