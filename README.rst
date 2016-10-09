Synopsis
========

Vodem Vodafone K4607-Z Web Interface Python bindings

|docs| |pypi|

Code Example
============

Use the simple interface::

    import vodem.simple

    vodem.simple.sms_send("+16175551212", "Message String")

    inbox = list(vodem.simple.sms_inbox_unread())

    vodem.simple.sms_delete(1)

For more advanced features, use the raw api::

    import vodem.api
    import vodem.util

    message = vodem.util.encode_sms_message("Message String")
    time = vodem.util.encode_time(datetime.datetime.now())
    number = "+16175551212;"

    vodem.api.sms_send({'Number' : number, 'sms_time' : time, 'MessageBody' : message })

Exception handling::

    import vodem.api
    import vodem.exceptions

    try:
        vodem.api.disconnect_network()
    except vodem.exceptions.VodemError as exc:
        raise

For more examples consult the examples directory

Motivation
==========

This interface is built to integrate sms capability into an application, or other functions of the vodem that are exposed via the web interface.

It requires the hardware vodem and activated sim card.

Installation
============

Using PyPi
----------

pip install vodem-vodafone-K4607-Z

Using Git
---------
::

    git clone https://github.com/alzeih/python-vodem-vodafone-K4607-Z.git
    cd python-vodem-vodafone-K4607-Z
    python setup.py build
    python setup.py install

API Reference
=============

See http://python-vodem-vodafone-k4607-z.readthedocs.org/

Tests
=====

Warning
-------

As some of the tests are potentially destructive, expensive, or annoying to others, it is best to run tests in a device without a sim card.

To ensure you have been made aware of the risks, read test/unit/api/__init__.py for instructions.

Unfortunately this restriction doesn't work without the top test module specified explicitly as this places unittest into discovery mode which ignores the load_tests protocol.

Running Tests
-------------

python -m unittest test

Contributors
============

Bugs, Feature requests, Documentation, and Contributions are tracked via this respository.

This project adheres to the `Open Code of Conduct`_. By participating, you are expected to honor this code.

.. _Open Code of Conduct: http://todogroup.org/opencodeofconduct/#Python Vodem Vodafone K4607-Z/alzeih@users.noreply.github.com

All code should be checked with pylint, tested and documented.

License
=======

MIT. See LICENCE.

.. |docs| image:: https://readthedocs.org/projects/python-vodem-vodafone-k4607-z/badge/?version=latest
    :target: http://python-vodem-vodafone-k4607-z.readthedocs.org/en/latest/?badge=latest
    :alt: Documentation Status

.. |pypi| image:: https://badge.fury.io/py/vodem-vodafone-K4607-Z.svg
    :target: https://badge.fury.io/py/vodem-vodafone-K4607-Z
    :alt: PyPi Version
