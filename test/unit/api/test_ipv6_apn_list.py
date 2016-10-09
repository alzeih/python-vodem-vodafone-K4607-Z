import unittest

from vodem.api import ipv6_apn_list


class TestIpv6ApnList(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_apn_list0': u'',
            'ipv6_apn_list1': u'',
            'ipv6_apn_list2': u'',
            'ipv6_apn_list3': u'',
            'ipv6_apn_list4': u'',
            'ipv6_apn_list5': u'',
            'ipv6_apn_list6': u'',
            'ipv6_apn_list7': u'',
            'ipv6_apn_list8': u'',
            'ipv6_apn_list9': u'',
        }

    def test_call(self):
        resp = ipv6_apn_list()
        self.assertEqual(self.valid_response, resp)
