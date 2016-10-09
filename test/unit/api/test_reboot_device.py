import unittest

from vodem.api import reboot_device


class TestRebootDevice(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = reboot_device()
        self.assertEqual(resp, None)
