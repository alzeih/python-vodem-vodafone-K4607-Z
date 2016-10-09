import unittest

from vodem.api import standby_dns_manual


class TestStandbyDnsManual(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'standby_dns_manual': '',
        }

    def test_call(self):
        resp = standby_dns_manual()
        self.assertEqual(self.valid_response, resp)
