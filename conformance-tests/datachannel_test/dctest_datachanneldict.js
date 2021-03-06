/*
 * Copyright (c) 2014 Peter Titz
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B: checks maxPacketLifeTime – must be initialized to null by default
 */
// Origin: W3C - 5.2.1 RTCDataChannel Attributes
function testDC_dict001() {
    var test = async_test("testDC_dict001: Set up a DataChannel and check the attribute maxPacketLifeTime - initialized to null by default", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict001");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            assert_equals(localChannel.maxPacketLifeTime, remoteChannel.maxPacketLifeTime, "maxPacketLifeTime not set correct: ");
            // Zero or null oninit 
            assert_true(localChannel.maxPacketLifeTime === 0 || localChannel.maxPacketLifeTime === null, "maxPacketLifeTime is not set to null by default got " + localChannel.maxPacketLifeTime + " - ");

            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel  with maxPacketLifeTime = 1000
- Peer A: checks maxPacketLifeTime

 */
// Origin: W3C - 5.2.1 RTCDataChannel Attributes
// FIXME @ Browser - maxPacketLifeTime is not available
// FIXME W3C: maxRetransmits/maxPAcketLifeTime initialisized to null should be in the WebIDL overview.
function testDC_dict002() {
    var dataChannelOptions = {
        maxPacketLifeTime : 1000,
    };
    test(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict002", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        assert_equals(localChannel.maxPacketLifeTime, 1000, "maxPacketLifeTime is incorrect: ");

    }, "testDC_dict002: Call .createDataChannel() with the attribute maxPacketLifeTime = " + dataChannelOptions.maxPacketLifeTime + " - after creation check maxPacketLifeTime", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel  with maxPacketLifeTime = 100000, exceeds user Agent maximum supported value
- Peer A: checks maxPacketLifeTime -  value must be set to the user agents maximum value

 */
// Origin: W3C - 5.1.2 Methods: 6, W3C: 5.2 maxPacketLifeTime (unsigned short) = 65535
// FIXME: Some Information about the user Agent maximum Value would be nice
function testDC_dict003() {
    var dataChannelOptions = {
        maxPacketLifeTime : 100000
    };
    var max = 65535;
    test(function() {
        var test = dataChannelOptions.maxPacketLifeTime % 65536;
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict003", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        if (test == localChannel.maxPacketLifeTime) {
            assert_equals(localChannel.maxPacketLifeTime, max, "maxPacketLifeTime not set to the maximum value (The moduulo value has been set: " + dataChannelOptions.maxPacketLifeTime + "% 65536 = " + localChannel.maxPacketLifeTime + ") ");
        } else {
            assert_equals(localChannel.maxPacketLifeTime, max, "maxPacketLifeTime not set to the maximum value");
        }

    }, "testDC_dict003: Call .createDataChannel() with the attribute maxPacketLifeTime = " + dataChannelOptions.maxPacketLifeTime + " exceeds user Agent max. supported value - value must set to the user agents max. value", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B: checks maxRetransmits – must be initialized to null by default

 */
// Origin: W3C - 5.2.1 RTCDataChannel Attributes
function testDC_dict004() {
    var test = async_test("testDC_dict004: Create a DataChannel and check the attribute - maxRetransmits - initialized null by default", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict004");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            assert_equals(localChannel.maxRetransmits, remoteChannel.maxRetransmits, "maxRetransmits not set correct: ");
            // Check if the value is null or zero 0 
            assert_true(localChannel.maxRetransmits === 0 || localChannel.maxRetransmits === null, "maxRetransmits is not set to null by default got " + localChannel.maxRetransmits + " - ");

            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel  with maxRetransmits = 1000
- Peer A: checks maxRetransmits

 */
// Origin: W3C - 5.2.1 RTCDataChannel Attributes
// function testDC_dict005() {
    // // Set mode to Unreliable
    // var dataChannelOptions = {
        // maxRetransmits : 1000
    // };
    // test(function() {
        // localPeerConnection = new RTCPeerConnection(iceServers);
        // try {
            // localChannel = localPeerConnection.createDataChannel("testDC_dict005", dataChannelOptions);
        // } catch(e) {
            // assert_unreached("An error was thrown " + e.name + ": " + e.message);
        // }
        // assert_equals(localChannel.maxRetransmits, dataChannelOptions.maxRetransmits, "maxRetransmits value is not set correct ");
// 
    // }, "testDC_dict005: Call .createDataChannel() with the attribute maxRetransmits = " + dataChannelOptions.maxRetransmits + " - after creation check maxRetransmits", {
        // timeout : 5000
    // });
// }

function testDC_dict005a() {
    var test = async_test("testDC_dict005a: Create a DataChannel and check the attribute - maxRetransmits - initialized to 10000", {
        timeout : 10000
    });
    var dataChannelOptions = {
        maxRetransmits : 1000
    };
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict005a",dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            assert_equals(localChannel.maxRetransmits, dataChannelOptions.maxRetransmits, "maxRetransmits not set on localChannel: ");
            assert_equals(localChannel.maxRetransmits, remoteChannel.maxRetransmits, "maxRetransmits not set on remoteChannel: ");
            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel  with maxRetransmits = 100000, exceeds user Agent maximum supported value
- Peer A: checks maxRetransmits -  value must be set to the user agents maximum value

 */
// Origin: W3C - 5.1.2 Methods: 6, W3C: 5.2 maxRetransmits (unsigned short) = 65535
// FIXME: Some Information about the user Agent maximum Value should be nice
function testDC_dict006() {
    var dataChannelOptions = {
        maxRetransmits : 100000
    };
    var max = 65535;
    test(function() {
        var test = dataChannelOptions.maxRetransmits % 65536;
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict006", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        if (test == localChannel.maxRetransmits) {
            assert_equals(localChannel.maxRetransmits, max, "maxRetransmits not set to the maximum value (The modulo value has been set: " + dataChannelOptions.maxRetransmits + " % 65536 = " + localChannel.maxRetransmits + ") ");
        } else {
            assert_equals(localChannel.maxRetransmits, max, "maxRetransmits not set to the maximum value");
        }

    }, "testDC_dict006: Call .createDataChannel() with the attribute maxRetransmits = " + dataChannelOptions.maxRetransmits + " exceeds user Agent max. supported value - value must set to the user agents max. value", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel  with maxPacketLifeTime and maxRetransmits
- Must throw  SyntaxError exception

 */
// Origin: W3C - 5.1.2 Methods: 5 - If both maxPacketLifeTime and maxRetransmits are set (not null) then throw a SyntaxError exception and abort
function testDC_dict007() {
    test(function() {
        var dataChannelOptions = {
            maxPacketLifeTime : 555,
            maxRetransmits : 555
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        // Here the API musst throw an error if Packet and Retransmits are implemented
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict007", dataChannelOptions);
        } catch(e) {
            assert_equals(errorName, "SyntaxError", "Wrong error was thrown ");
        }
        assert_unreached("No error was thrown and values are set to maxPacketLifeTime: " + localChannel.maxPacketLifeTime + " and maxRetransmits: " + localChannel.maxRetransmits + " : ");

    }, "testDC_dict007: Call .createDataChannel() and set maxPacketLifeTime and maxRetransmits (both not null) - must throw a SyntaxError exception", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel  with maxRetransmitTime (OLD API) and maxRetransmits
- Must throw  SyntaxError exception

 */
// OLD API VERSION -  maxRetransmitTime
// Origin: W3C - 5.1.2 Methods: 5 - If both maxPacketLifeTime and maxRetransmits are set (not null) then throw a SyntaxError exception and abort
function testDC_dict008() {
    test(function() {
        var dataChannelOptions = {
            maxRetransmitTime : 555,
            maxRetransmits : 555
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict008", dataChannelOptions);
        } catch(e) {
            assert_equals(e.name, "SyntaxError", "Wrong error was thrown ");
        }
        assert_unreached("No error was thrown ");
    }, "testDC_dict008: Call .createDataChannel() and set maxRetransmitTime and maxRetransmits (not null) - must throw a SyntaxError exception - (Old API - maxRetransmitTime)", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel  with maxPacketLifeTime = null  and maxRetransmits = null (the Attributes are nullable)
- Peer A: checks attributes , expected zero 0 or null

 */
// Origin: W3C - 5.2.1 Attributes
function testDC_dict009() {
    var dataChannelOptions = {
        maxRetransmits : null,
        maxPacketLifeTime : null
    };
    test(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict009", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        // Type is unsigned short = 0
        assert_true(localChannel.maxPacketLifeTime === 0 || localChannel.maxPacketLifeTime === null, "maxPacketLifeTime is not set to null by default got " + localChannel.maxPacketLifeTime + " - ");
        assert_true(localChannel.maxRetransmits === 0 || localChannel.maxRetransmits === null, "maxRetransmits is not set to null by default got " + localChannel.maxRetransmits + " - ");

    }, "testDC_dict009: Call .createDataChannel() with the attribute maxRetransmits = " + dataChannelOptions.maxRetransmits + " and maxPacketLifeTime = " + dataChannelOptions.maxPacketLifeTime, {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B: checks ordered  – must be true by default

 */
// Origin: W3C - 5.2.1 Attributes - ordered - must be initialized to true by default
function testDC_dict010() {
    var test = async_test("Set up a DataChannel and check the attribute ordered of type boolean - must be initialized to true by default", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict010");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            assert_equals(localChannel.ordered, remoteChannel.ordered, "ordered not set correct: ");
            assert_equals(localChannel.ordered, true, "ordered init wrong: ");
            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel with ordered = false
- Peer B: waits for the DataChannel 
- Peer A/B: checks ordered  

 */
// Origin: W3C - 5.2.1 Attributes
function testDC_dict011() {
    var test = async_test("Set up a DataChannel and set the attribute ordered = false", {
        timeout : 10000
    });
    test.step(function() {
        var dataChannelOptions = {
            ordered : false,
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict011", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
            test.done();
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            remoteChannel.onopen = test.step_func(function() {
                assert_false(localChannel.ordered, "Ordered value is not set correct");
                assert_equals(localChannel.ordered, remoteChannel.ordered, "Ordered value is not set correct");
                test.done();
            });
        });

    });
}

/**
- Peer A: creates a DataChannel  
- Peer A: checks negotiated default value = false

 */
// Origin: W3C - 5.2.1 Attributes
function testDC_dict012() {
    test(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict012");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        if ( typeof localChannel.negotiated == "undefined") {
            assert_unreached("Can't get the value of negotiated get " + localChannel.negotiated + ": ");
        } else {
            assert_equals(localChannel.negotiated, false, " Negotiated default value is wrong: ");
        }
    }, "Call .createDataChannel() and check negotiated default value = false", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B: checks negotiated value  - must be initialized to false by default

 */
// Origin: W3C - 5.2.1 Attributes - negotiated - boolean - negotiated value retrunes true if the channel was negotiated by the application or false otherwise
function testDC_dict013() {
    var test = async_test("Set up a DataChannel and check the attribute negotiated of type boolean - must be initialized to false by default", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict013");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            // can get negotiated Value
            if ( typeof localChannel.negotiated == "undefined") {
                assert_unreached("Can't get the value of negotiated get " + localChannel.negotiated + ": ");
            } else {
                assert_equals(localChannel.negotiated, remoteChannel.negotiated, "negotiated not set correct: ");
                assert_equals(localChannel.negotiated, false, "negotiated init wrong: ");
            }
            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B: checks default values ordered = true, protocol =”” and negotiated = false 

 */
// Origin: W3C - 5.1.2 dataChannelDict optional set, check init
function testDC_dict014() {
    var test = async_test("Set up a DataChannel without setting the dataChannelDict - check default values ordered = true , protocol = \"\" and negotiated = false", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict014");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            remoteChannel.onopen = test.step_func(function() {
                assert_true(localChannel.ordered, "Ordered value is not correct ");
                assert_equals(localChannel.ordered, remoteChannel.ordered, "Ordered value is not correct ");
                assert_equals(localChannel.protocol, "", "Negotiated value is not correct ");
                assert_equals(localChannel.protocol, remoteChannel.protocol, "Negotiated value is not correct ");
                assert_false(localChannel.negotiated, "Negotiated value is not correct ");
                assert_equals(localChannel.negotiated, remoteChannel.negotiated, "Negotiated value is not correct ");
                test.done();
            });
        });
    });
}

/**
- Peer A: creates a DataChannel  with attributes ordered = false, id = 70 and maxRetransmits = 2222
- Peer B: waits for the DataChannel 
- Peer A/B: checks values ordered = false, id =70 and maxRetransmits = 2222

 */
// Origin: W3C - 5.1.2 Methods: 4, W3C - 5.2.1 Attributes
function testDC_dict015() {
    var dataChannelOptions = {
        ordered : false,
        id : 70,
        maxRetransmits : 2222
    };
    var test = async_test("Set up a DataChannel with the attributes ordered = " + dataChannelOptions.ordered + ", id = " + dataChannelOptions.id + " and maxRetransmits = " + dataChannelOptions.maxRetransmits, {
        timeout : 10000
    });
    test.step(function() {
        if(mozSafeMode)
            assert_unreached("Mozilla Firefox Safe Mode is activated - This test usually leads to crash ");
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict015", dataChannelOptions);

        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            remoteChannel.onopen = test.step_func(function() {
                assert_equals(localChannel.ordered, dataChannelOptions.ordered, "Can't set ordered: ");
                assert_equals(localChannel.id, dataChannelOptions.id, "Can't set id: ");
                assert_equals(localChannel.maxRetransmits, dataChannelOptions.maxRetransmits, "Can't set maxRetransmits: ");
                assert_equals(remoteChannel.ordered, dataChannelOptions.ordered, "Can't set ordered: ");
                assert_equals(remoteChannel.id, dataChannelOptions.id, "Can't set id: ");
                assert_equals(remoteChannel.maxRetransmits, dataChannelOptions.maxRetransmits, "Can't set maxRetransmits: ");
                test.done();
            });
        });
    });
}

/**
- Peer A: creates a DataChannel  
- Peer A: tries to change attribute ordered, maxRetransmits, negotiated and label
- Peer A: checks attributes – should be unchangeable

 */
// Origin: W3C - 5.2 RTCDataChannel - The properties of a channel cannot change after the channel has been created (Unchangeable: label, maxPacketLifeTime, maxRetransmits, negotiated, ordered, protocoll)
// FIXME: BROWSER  - Firefox has no value maxRetransmit after channel creation, so if you want to change it a new value added to the dataChannel object
function testDC_dict016() {
    test(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict016");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        localChannel.ordered = false;
        assert_equals(localChannel.ordered, true, "ordered  is changeable!");

        var mR = localChannel.maxRetransmits;
        localChannel.maxRetransmits = 500;
        assert_equals(localChannel.maxRetransmits, mR, "maxRetransmits is changeable");

        localChannel.negotiated = true;
        assert_equals(localChannel.negotiated, false, "negotiated  is changeable!");

        var label = localChannel.label;
        localChannel.label = "neu";
        assert_equals(localChannel.label, label, "label  is changeable!");

    }, "Call .createDataChannel() after creation try to change ordered, maxRetransmits, negotiated and label - should be unchangeable", {
        timeout : 5000
    });
}

/**
- Peer A: creates a DataChannel  
- Peer B: waits for the DataChannel 
- Peer A/B: checks  if id is a number in unsigned short range and the same on both peers

 */
// Origin: W3C -  5.1.2 Methods: 7, If id attribute is uninitialized (not set via the dictionary) initialize it to a value generated by the user Agent, according to the WebRTC DataChannel Protocol specification
function testDC_dict017() {
    var test = async_test("Set up a DataChannel - check if the id set from the user Agent", {
        timeout : 10000
    });
    test.step(function() {
        // 2 ^16 unsigned short  65536 = 0 - 65535
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict017");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            remoteChannel.onopen = test.step_func(function() {
                assert_true((localChannel.id >= 0) && localChannel.id < 65536, "datachannel id not set correct");
                assert_true((remoteChannel.id >= 0) && remoteChannel.id < 65536, "datachannel id not set correct");
                assert_equals(remoteChannel.id, localChannel.id, "DataChannel id are not equal");
                test.done();
            });
        });

    });
}

/**
- Peer A: creates a DataChannel 
- Peer B: waits for the DataChannel 
- Peer A/B:  checks protocol value – must be initialized to empty string by default

 */
// Origin: W3C - 5.2.1 Attributes
// DataChannel: Attribute - protocol - DOMString
function testDC_dict018() {
    var test = async_test("Set up a DataChannel - check the attribute protocol of type DOMString - must be initialized to empty string by default", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict018");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            assert_equals(localChannel.protocol, remoteChannel.protocol, "protocol not set correct: ");
            assert_equals(localChannel.protocol, "", "protocol init wrong: ");
            test.done();
        });
    });
}


/**
- Peer A: creates a DataChannel  
- Peer B: waits for the DataChannel 
- Peer A/B: : tries to change attribute ordered, maxRetransmits, negotiated and label
- Peer A/B:  checks attributes – should be unchangeable

 */
// Origin: W3C - 5.2 RTCDataChannel - The properties of a channel cannot change after the channel has been created (Unchangeable: label, maxPacketLifeTime, maxRetransmits, negotiated, ordered, protocoll)
// FIXME: BROWSER  - Firefox has no value maxRetransmit after channel creation, so if you want to change it a new value added to the dataChannel object
function testDC_dict019() {
    var test = async_test("Set up a DataChannel - after creation try to change ordered, maxRetransmits, negotiated and label on both sides- should be unchangeable", {
        timeout : 10000
    });
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict019");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remotePeerConnection.ondatachannel = test.step_func(function(e) {
            remoteChannel = e.channel;
            
            localChannel.ordered = false;
            remoteChannel.ordered = false;
            assert_equals(localChannel.ordered, true, "ordered  is changeable!");
            

            var mR = localChannel.maxRetransmits;
            localChannel.maxRetransmits = 500;
            remoteChannel.maxRetransmits = 500;
            assert_equals(localChannel.maxRetransmits, mR, "maxRetransmits is changeable");
    
            localChannel.negotiated = true;
            remoteChannel.negotiated = true;
            assert_equals(localChannel.negotiated, false, "negotiated  is changeable!");
    
            var label = localChannel.label;
            localChannel.label = "neu";
            remoteChannel.label = "neu";
            assert_equals(localChannel.label, label, "label  is changeable!");
            
            
            assert_equals(localChannel.ordered, remoteChannel.ordered, "ordered value ist different ");
            assert_equals(localChannel.maxRetransmits, remoteChannel.maxRetransmits, "maxRetransmits value is different ");
            assert_equals(localChannel.negotiated, remoteChannel.negotiated, "ordered value ist different ");
            assert_equals(localChannel.label, remoteChannel.label, "ordered value ist different ");
            test.done();
        });
    });
}

/**
- Peer A: creates a DataChannel  with id= 5 and negotiated = false
- Peer B: creates a DataChannel  with id= 5 and negotiated = true
- Peer A: creates offer  - try to establish a connection - should fail

 */
// Origin: W3C - 5.2 RTCDataChannel - Two ways establish a connection
// FIXME: W3C and Browser can establish a connection between two peers with different negotiated values
function testDC_dict020() {
    var test = async_test("Try to set up DataChannel by creating two corresponding DataChannels with same id and different negotiated values (true/false) - try to establish a connection - should fail", {
        timeout : 10000
    });
    // After 9 Sec. no connection established all is fine
    setTimeout(test.step_func(function() {test.done();}),9000);
    dataChannelOptions1 ={
        negotiated : false,
        id :5 
    };
    dataChannelOptions2 ={
        negotiated : true,
        id :5 
    };
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict020", dataChannelOptions1 );
            remoteChannel = remotePeerConnection.createDataChannel("testDC_dict020", dataChannelOptions2);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        setTimeout(createIceCandidatesAndOffer, 1000);
            
        localChannel.onmessage = test.step_func(function(e) {
            assert_unreached("Can establish a DataChannel connection between two peers with different negotiated value "); 
            test.done();
        });
        remoteChannel.onopen = test.step_func(function() {
            remoteChannel.send("noo");
        }); 


    });
}


/**
- Peer A: creates a DataChannel  with id= 5 and negotiated = false
- Peer B: creates a DataChannel  with id= 5 and negotiated = false
- Peer A: creates offer  - try to establish a connection - should fail

 */
// Origin: W3C - 5.2 RTCDataChannel - Two ways establish a connection
// FIXME: W3C and Browser can establish a connection between two peers with different negotiated values
function testDC_dict021() {
    var test = async_test("Try to set up DataChannel by creating two corresponding DataChannels with the same id and negotiated = false - try to establish a connection - should fail ", {
        timeout : 10000
    });
    // After 9 Sec. no connection established all is fine
    setTimeout(test.step_func(function() {test.done();}),9000);
    dataChannelOptions1 ={
        negotiated : false,
        id :5 
    };
    dataChannelOptions2 ={
        negotiated : false,
        id :5 
    };
    test.step(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict021", dataChannelOptions1 );
            remoteChannel = remotePeerConnection.createDataChannel("testDC_dict021", dataChannelOptions2);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        setTimeout(createIceCandidatesAndOffer, 1000);
            
        localChannel.onmessage = test.step_func(function(e) {
            assert_unreached("Can establish a DataChannel connection between two peers by creating dataChannel with same id and negotiated = false "); 
            test.done();
        });
        remoteChannel.onopen = test.step_func(function() {
            remoteChannel.send("noo");
        }); 


    });
}



/**
- Peer A: creates a DataChannel  with id= 5 and negotiated = true
- Peer B: creates a DataChannel  with id= 5 and negotiated = true
- Peer A: creates offer  - try to establish a connection 
- Peer A: sends short test message
- Peer B: checks message

 */
// Origin: W3C - 5.2 RTCDataChannel - establish connection with negotiated = true and same id - This way make it possible to create channels with asymmetric properties
// FIXME: Browser - Firefox Negotiated is undefined but it works, cant get negotiated value after channel creation
function testDC_dict022() {
    var data = "test";
    var test = async_test("Try to set up DataChannel by creating two corresponding DataChannels with the same id and negotiated = true - try to establish a connection - send message", {
        timeout : 10000
    });
    test.step(function() {
        var dataChannelOptions = {
            id : 2,
            negotiated : true
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);
        // Create two DataChannels
        // First local
        try {
            localChannel = localPeerConnection.createDataChannel("negotiated channel", dataChannelOptions);
            remoteChannel = remotePeerConnection.createDataChannel("negotiated channel", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remoteChannel.onmessage = test.step_func(function(e) {
            assert_equals(e.data, data, "Rec: wrong Data ");
            test.done();
        });
        localChannel.onopen = test.step_func(function() {
            localChannel.send(data);
        });
    });
}

/**
- Peer A: creates a DataChannel  with id= 5 and negotiated = true
- Peer B: creates a DataChannel  with id= 5, negotiated = true, ordered = false and another label
- Peer A: creates offer  - try to establish a connection 
- Peer A: sends short test message 
- Peer A/B:  checks different values
- Peer B: checks message

 */
// Origin: W3C - 5.2 RTCDataChannel - establish connection with negotiated = true and same id - This way make it possible to create channels with asymmetric properties
// FIXME: Browser - Firefox Negotiated is undefined but it works, cant get negotiated value after channel creation
function testDC_dict023() {
    // 1 KB
    var data = generateData(10);
    var test = async_test("Try to set up DataChannel by creating two corresponding DataChannels with the same id and negotiated true - try to establish a connection with asymetric options (label, ordered) - send message", {
        timeout : 10000
    });
    test.step(function() {
        var dataChannelOptions1 = {
            id : 2,
            ordered : false,
            negotiated : true
        };
        var dataChannelOptions2 = {
            id : 2,
            ordered : true,
            negotiated : true
        };

        localPeerConnection = new RTCPeerConnection(iceServers);
        remotePeerConnection = new RTCPeerConnection(iceServers);

        // Create two DataChannels
        // First local
        try {
            localChannel = localPeerConnection.createDataChannel("negotiated channel - local", dataChannelOptions1);
            remoteChannel = remotePeerConnection.createDataChannel("negotiated channel - remote", dataChannelOptions2);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        createIceCandidatesAndOffer();
        remoteChannel.onmessage = test.step_func(function(e) {
            assert_equals(e.data, data, "Rec: wrong Data ");
            test.done();
        });
        remoteChannel.onopen = test.step_func(function() {
            assert_not_equals(localChannel.ordered, remoteChannel.ordered, "not set ordered different in both channels");
            assert_not_equals(localChannel.label, remoteChannel.label, "not set label different in both channels");
            localChannel.send(data);
        });

    });
}

/**
- Peer A: creates a DataChannel  
- Peer A: checks reliable default value = true (OLD  API)

 */
// Origing: W3C - OLD API
// FIXME .reliable is deprecated
function testDC_dict024() {
    test(function() {
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict024");
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        assert_equals(localChannel.reliable, true, "Reliable mode not set correct!");
    }, "Call .createDataChannel() and check reliable (OLD API - deprecated) default value = true", {
        timeout : 5000
    });
}


/**
 * DEPRECATED TESTS 
 */
// Origing: W3C - OLD API
// FIXME .reliable is deprecated
function testOLD_DC_dict025() {
    test(function() {
        var dataChannelOptions = {
            maxPacketLifeTime : 1000 // If set the mode turns to unreliabele , eg. reliable = false
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        // Here the API musst throw an error if Packet and Retransmits are implemented
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict025", dataChannelOptions);
        } catch(e) {

            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        assert_equals(localChannel.reliable, false, "Reliable mode not set correct!");

    }, "Call .createDataChannel() with maxPacketLifeTime = 10000 - check reliable (OLD API - deprecated), should be false", {
        timeout : 3000
    });
}

// DataChannel not setting = reliable mode setting maxRetransmit or maxPacketLifeTime --> unreliable mode
// W3C: 5.2 RTCDataChannel, transport
// FIXME .reliable is deprecated
function testOLD_DC_dict026() {
    test(function() {
        var dataChannelOptions = {
            maxRetransmits : 1000 // If set the mode turns to unreliabele , eg. reliable = false
        };
        localPeerConnection = new RTCPeerConnection(iceServers);
        try {
            localChannel = localPeerConnection.createDataChannel("testDC_dict026", dataChannelOptions);
        } catch(e) {
            assert_unreached("An error was thrown " + e.name + ": " + e.message);
        }
        assert_equals(localChannel.reliable, false, "Reliable mode not set correct!");
    }, "Call .createDataChannel() with maxRetransmits = 1000 - check reliable (OLD API - deprecated), should be false", {
        timeout : 3000
    });
}
