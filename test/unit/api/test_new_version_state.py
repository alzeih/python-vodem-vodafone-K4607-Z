import unittest

from vodem.api import new_version_state


class TestNewVersionState(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'new_version_state': '0',
        }

    def test_call(self):
        resp = new_version_state()
        self.assertEqual(self.valid_response, resp)
