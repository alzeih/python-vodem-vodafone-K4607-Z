import unittest

from vodem.api import if_upgrade


class TestIfUpgrade(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'failure',
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = if_upgrade()
        self.assertEqual(self.valid_response, resp)
