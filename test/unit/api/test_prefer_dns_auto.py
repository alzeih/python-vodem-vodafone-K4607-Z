import unittest

from vodem.api import prefer_dns_auto


class TestPreferDnsAuto(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'prefer_dns_auto': '',
        }

    def test_call(self):
        resp = prefer_dns_auto()
        self.assertEqual(self.valid_response, resp)
