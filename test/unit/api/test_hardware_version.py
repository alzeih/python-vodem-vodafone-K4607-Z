import unittest

from vodem.api import hardware_version


class TestHardwareVersion(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'hardware_version': 'Ver.B(T2)',
        }

    def test_call(self):
        resp = hardware_version()
        self.assertEqual(self.valid_response, resp)
