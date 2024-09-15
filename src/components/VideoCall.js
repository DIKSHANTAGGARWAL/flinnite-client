import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import '../css/videoCall.css';  // Import the custom CSS
import { useParams } from 'react-router-dom';

const socket = io(`${process.env.REACT_APP_server_url}`);

function VideoCall() {
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const myVideo = useRef();
    const videoGrid = useRef();
    const peersRef = useRef([]);
    const params = useParams();
    const groupId = params.id; // Assuming groupId is passed via URL params

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }

            // Join group call
            socket.emit('joinGroupCall', { groupId });

            socket.on('groupMembers', (members) => {
                const peersArray = [];
                members.forEach(memberId => {
                    const peer = createPeer(memberId, socket.id, stream);
                    peersRef.current.push({ peerID: memberId, peer });
                    peersArray.push(peer);
                });
                setPeers(peersArray);
            });

            socket.on('newPeer', (peerId) => {
                const peer = addPeer(peerId, stream);
                peersRef.current.push({ peerID: peerId, peer });
                setPeers(prevPeers => [...prevPeers, peer]);
            });

            socket.on('receiveSignal', ({ signal, callerID }) => {
                const item = peersRef.current.find(p => p.peerID === callerID);
                if (item) {
                    item.peer.signal(signal);
                }
            });
        });

        return () => {
            socket.off('groupMembers');
            socket.off('newPeer');
            socket.off('receiveSignal');
        };
    }, [groupId]);

    const createPeer = (peerID, callerID, stream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socket.emit('sendSignal', { userToSignal: peerID, callerID, signal });
        });

        peer.on('stream', (stream) => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.className = 'peer-video';
            videoGrid.current.append(videoElement);
        });

        return peer;
    };

    const addPeer = (incomingSignal, stream) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socket.emit('returnSignal', { signal, callerID: incomingSignal });
        });

        peer.on('stream', (stream) => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.className = 'peer-video';
            videoGrid.current.append(videoElement);
        });

        peer.signal(incomingSignal);

        return peer;
    };

    return (
        <div className="video-call-container">
            <div ref={videoGrid} className="video-grid">
                <video playsInline muted ref={myVideo} autoPlay className="my-video" />
            </div>
        </div>
    );
}

export default VideoCall;
