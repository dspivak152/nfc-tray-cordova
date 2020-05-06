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
//window.foo = 123;
(function () {
    window.foo = function (data) {
        this.console.log('data', data);
        var ndefMessage = [ndef.textRecord(JSON.stringify(data))];
        //var ndefMessage = [ ndef.textRecord('Hello danny') ];
        nfc.write(
            ndefMessage,
            function () {
                alert('Wrote data to NFC tag');
            },
            function (err) {
                //alert('ERROR: Failed to write message to NFC tag');
                alert(err);
            }
        );
    };
}).call(this);

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        console.log('deviceready');
        nfc.beginSession();
        nfc.addNdefListener(
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessage = tag.ndefMessage;
                //alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
                alert('Got data from tray, go to registration page');
                localStorage.setItem('dataFromTray', nfc.bytesToString(ndefMessage[0].payload).substring(3));
            },
            function () {
                //alert("Waiting for NDEF tag");
            },
            function (error) { // error callback
                alert("Error adding NDEF listener " + JSON.stringify(error));
            }
        );

        nfc.addNdefFormatableListener(
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessage = tag.ndefMessage;
                alert(JSON.stringify(ndefMessage));
                alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
            },
            function () { // success callback
                console.log('Also listening for tags that are NDEF formatable tags');
            },
            function (error) { // error callback
                alert('Error adding NDEF listener ' + JSON.stringify(error));
            }
        );
    },
    // Update DOM on a Received Event
    // receivedEvent: function (id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // }
};

app.initialize();