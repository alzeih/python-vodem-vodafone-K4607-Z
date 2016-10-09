import unittest

from vodem.api import current_upgrade_state


class TestCurrentUpgradeState(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'current_upgrade_state': '0',
        }

    def test_call(self):
        resp = current_upgrade_state()
        self.assertEqual(self.valid_response, resp)
