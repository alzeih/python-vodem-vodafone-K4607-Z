import unittest

from vodem.api import standby_dns_auto


class TestStandbyDnsAuto(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'standby_dns_auto': '',
        }

    def test_call(self):
        resp = standby_dns_auto()
        self.assertEqual(self.valid_response, resp)
