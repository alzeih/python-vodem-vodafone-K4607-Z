""" Api Tests are skipped unless VODAFONE_DESTRUCTIVE is set.

This is because these tests WILL make requests to a working device
that are potentially:
    * destructive
    * expensive
    * annoying to others

It is STRONGLY suggested you remove the simcard to run these tests.

By setting the environment variable VODAFONE_DESTRUCTIVE you agree
you have actually read the above warning and will not complain, file
a bug report, alter this check or otherwise behave in a manner that
is consistent with the belief that this is not entirely your own fault
for any cost or loss of data.
"""
import os
import unittest
from unittest import SkipTest, TestSuite


def load_tests(loader, standard_tests, pattern):
    if os.getenv("VODAFONE_DESTRUCTIVE") == None:
        raise SkipTest('These tests may delete your data or cost you money.'
                       'Please read help({0})'.format(__name__))
    this_dir = os.path.dirname(__file__)
    package_tests = loader.discover(start_dir=this_dir, pattern=pattern)
    standard_tests.addTests(package_tests)
    return standard_tests
