/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
(function () {
    window.sendMessageToNfc = function (data) {
        var ndefMessage = [ndef.textRecord(JSON.stringify(data))];
        nfc.write(
            ndefMessage,
            function () {
                alert('Wrote data to NFC tag');
            },
            function (err) {
                alert(err);
            }
        );
    };

    window.resetNFC = function () {
        //var ndefMessage = [ndef.textRecord(JSON.stringify("Reset NFC"))];
        nfc.erase(
            function () {
                alert('Erased NFC tag');
            },
            function (err) {
                alert(err);
            }
        );
    };
}).call(this);

function writeTag(nfcEvent) {
    var ndefMessage = [ndef.textRecord(JSON.stringify("init data"))];
    nfc.write(
        ndefMessage,
        function () {
            alert('Initial process done.');
        },
        function (reason) {
            navigator.notification.alert(reason, function () { }, "There was a problem");
        }
    );
}

var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        nfc.beginSession();
        nfc.disableReaderMode();
        nfc.addNdefListener(
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessage = tag.ndefMessage;
                var existingData = nfc.bytesToString(ndefMessage[0].payload).substring(3);
                var tagId = nfc.bytesToHexString(tag.id);
                if (tagId) {
                    alert('Found tag ID');
                }

                var storageObject = { tagId: tagId, existingData: existingData };
                localStorage.removeItem('nfcData');
                localStorage.setItem('nfcData', JSON.stringify(storageObject));
            },
            function () {
                //alert("Waiting for NDEF tag");
            },
            function (error) { // error callback
                alert("Error adding NDEF listener " + JSON.stringify(error));
            }
        );

        nfc.addTagDiscoveredListener(writeTag, win, fail);

    },
    // Update DOM on a Received Event
    // receivedEvent: function (id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    //}
};

app.initialize();

function win() {
    console.log("Listening for NDEF tags");
}

function fail() {
    alert('Failed to register NFC Listener');
}
