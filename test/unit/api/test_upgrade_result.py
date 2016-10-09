import unittest

from vodem.api import upgrade_result


class TestUpgradeResult(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'upgrade_result': 'error',
        }

    def test_call(self):
        resp = upgrade_result()
        self.assertEqual(self.valid_response, resp)
