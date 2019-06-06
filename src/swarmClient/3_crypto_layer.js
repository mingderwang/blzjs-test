// Copyright (C) 2019 Bluzelle
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License, version 3,
// as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.


const assert = require('assert');
const { verify, sign } = require('./ecdsa_secp256k1');
const bluzelle_pb = require('../../proto/bluzelle_pb');
const database_pb = require('../../proto/database_pb');
const status_pb = require('../../proto/status_pb');


module.exports = class Crypto {

    constructor({private_pem, public_pem, onIncomingMsg, onOutgoingMsg, log}) {

        this.log = log;

        this.private_pem = private_pem;
        this.public_pem = public_pem;

        this.onIncomingMsg = onIncomingMsg;
        this.onOutgoingMsg = onOutgoingMsg;

    }


    sendOutgoingMsg(bzn_envelope, msg) {

        assert(bzn_envelope instanceof bluzelle_pb.bzn_envelope);


        // Skip status requests

        if(msg instanceof status_pb.status_request) {

            bzn_envelope.setStatusRequest(msg.serializeBinary());

            this.onOutgoingMsg(bzn_envelope);
            return;
        }

        
        // quickreads are not signed
        const isQuickread = msg.hasQuickRead();

        bzn_envelope.setDatabaseMsg(msg.serializeBinary());


        if(!isQuickread) {

            bzn_envelope.setSender(this.public_pem);

            const signed_bin = Buffer.concat([
                bzn_envelope.getSender(), 
                bzn_envelope.getPayloadCase(),                 
                Buffer.from(bzn_envelope.getDatabaseMsg()),
                bzn_envelope.getTimestamp()
            ].map(deterministic_serialize));

            bzn_envelope.setSignature(new Uint8Array(sign(signed_bin, this.private_pem)));
        }



        this.onOutgoingMsg(bzn_envelope);

    }


    sendIncomingMsg(bzn_envelope) {

        assert(bzn_envelope instanceof bluzelle_pb.bzn_envelope);


        // Verification of incoming messages

        const payload = 
            bzn_envelope.hasDatabaseResponse() ? 
                bzn_envelope.getDatabaseResponse() : 
                bzn_envelope.getStatusResponse();

        const signed_bin = Buffer.concat([
            bzn_envelope.getSender(), 
            bzn_envelope.getPayloadCase(), 
            Buffer.from(payload), 
            bzn_envelope.getTimestamp()
        ].map(deterministic_serialize));



        // quickreads skip verification
        if(bzn_envelope.hasDatabaseResponse()) {
            
            const database_response = database_pb.database_response.deserializeBinary(new Uint8Array(bzn_envelope.getDatabaseResponse()));

            if(database_response.hasQuickRead()) {
                this.onIncomingMsg(bzn_envelope);
                return;
            }
        }   

        if(!verify(Buffer.from(signed_bin), Buffer.from(bzn_envelope.getSignature()), bzn_envelope.getSender())) {            
            this.log && this.log('Bluzelle: signature failed to verify: ' + Buffer.from(bin).toString('hex'));
        }

        this.onIncomingMsg(bzn_envelope);

    }

};


// see crypto.cpp in daemon

const deterministic_serialize = obj => {

    if(obj instanceof Buffer) {

        return Buffer.concat([
            Buffer.from(obj.length.toString() + '|', 'ascii'),
            obj
        ]);

    }


    // numbers and strings

    return Buffer.from(obj.toString().length + '|' + obj.toString(), 'ascii');

};