import unittest

from vodem.api import ipv4_apn_list


class TestIpv4ApnList(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv4_apn_list0': '',
            'ipv4_apn_list1': '',
            'ipv4_apn_list2': '',
            'ipv4_apn_list3': '',
            'ipv4_apn_list4': '',
            'ipv4_apn_list5': '',
            'ipv4_apn_list6': '',
            'ipv4_apn_list7': '',
            'ipv4_apn_list8': '',
            'ipv4_apn_list9': '',
        }

    def test_call(self):
        resp = ipv4_apn_list()
        self.assertEqual(self.valid_response, resp)
