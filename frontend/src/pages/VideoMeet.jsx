// import React, { useEffect, useRef, useState } from 'react'
// import '../style/VideoMeet.css'
// import { Button, TextField } from '@mui/material';
// import { io } from "socket.io-client";

// const server_url="http://localhost:8000"

// const connections={};
// const peerConfigConnections={
//     "iceServers":[
//         {"urls":"stun:stun.l.google.com:19302"}

//     ]
// }
// const VideoMeetComponent = () => {
//     var socketRef=useRef()
//     let socketIdRef=useRef()

//     let localVideoRef=useRef();
//     let [videoAvailable,setVideoAvailable]=useState(true)
//     let[audioAvailable,setAudioAvailable]=useState(true)
//     let [video, setVideo]=useState([]) 
//     let [audio,setAudio]=useState()
//     let [screen,setScreen]=useState()
//     let [showModel,setShowModel]=useState()
//     let [screenAvailable,setScreenAvailable]=useState()
//     let [messages,setMessages]=useState()
//     let [message,setMessage]=useState()
//     let [newMessages,setNewMessages]=useState(0);
//     let [askForUsername,setAskForUsername]=useState(true)
//     let [username,setUsername]=useState("")
//     const videoRef=useRef([])
//     let [videos,setVideos]=useState([])




//     const getPermissions= async ()=>{
//         try {
//             const videoPermission= await navigator.mediaDevices.getUserMedia({video:true})

//             if (videoPermission) {
//                 setVideoAvailable(true)
//             }else{
//                 setVideoAvailable(false)
//             }

//             const AudioPermission= await navigator.mediaDevices.getUserMedia({audio:true})

//             if (AudioPermission) {
//                 setAudioAvailable(true)
//             }else{
//                 setAudioAvailable(false)
//             }


//             if(navigator.mediaDevices.getDisplayMedia){
//                   setScreenAvailable(true)
//             }else{
//                 setScreenAvailable(false)
//             }

//             if(videoAvailable || audioAvailable){
//                 const userMediaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable, audio:audioAvailable})
//                 if(userMediaStream){
//                    window.localStream=userMediaStream;
//                    if (localVideoRef.current) {
//                        localVideoRef.current.srcObject= userMediaStream
//                    }
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }



//     useEffect(()=>{
//         getPermissions()

//     },[])


//     let getUserMediaSuccess=(stream)=>{     ///getusermedia success
//           try {
//             window.localStream.getTracks().forEach(track=>track.stop())
//           } catch (error) {
//             console.log(error);
//           }
//           window.localStream=stream
//           localVideoRef.current.srcObject=stream

//           for(let id in connections){
//             if (id===socketIdRef.current) continue;
//             connections[id].addStream(window.localStream)

//             connections[id].createOffer().then((description)=>{
//                 connections[id].setLocalDescription(description)
//                 .then(()=>{
//                     socketIdRef.current.emit('signal', id, JSON.stringify({"sdp":connections[id].localDescription}))
//                 }).catch(e=>console.log(e))
//             })
//           }
//           stream.getTracks().forEach(track=>track.onended=()=>{
//             setVideo(false)
//             setAudio(false)
//             try {
//                 let tracks=localVideoRef.current.srcObject.getTracks()
//                    tracks.forEach(track=>track.stop())

//             } catch (error) {
//                 console.log(error);
//             }
//             let blackSlience= (...args)=>new MediaStream([black(...args),silence()])
//                 window.localStream=blackSlience();
//                 localVideoRef.current.srcObject=window.localStorage;

//             for(let id in connections){
//                 connections[id].addStream(window.localStream)
//                 connections[id].createOffer().then((description)=>{
//                     connections[id].setLocalDescription(description)
//                     .then(()=>{
//                         socketRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription }))
//                     }).catch(e=>console.log(e))
//                 })
//             }
//           })
//     }

//     let silence=()=>{
//         let ctx= new AudioContext()
//         let oscillator=ctx.createOscillator()
//         let dst= oscillator.connect(ctx.createMediaStreamDestination())
//         oscillator.start();
//         ctx.resume()
//         return Object.assign(dst.stream.getAudioTrack()[0],{ enable:false})
//     }
//         let black=({width=640, height=480}={})=>{
//             let canvas=Object.assign(document.createElement("canvas"),{width,height})

//             canvas.getContext('2d').fillRect(0,0, width, height)
//             let stream=canvas.captureStream();
//             return Object.assign(stream.getVideoTracks()[0],{enable:false})

//         }
    

//  let getUserMedia=()=>{
//     if((video && videoAvailable)  || (audio && audioAvailable)){
//         navigator.mediaDevices.getUserMedia({video:video,audio:audio})
//         .then(getUserMediaSuccess)
//         .then((stream)=>{})
//         .catch((e)=>console.log(e))

//     }else{
//         try {
//             let tracks =localVideoRef.current.srcObject.getTracks()
//             tracks.forEach(track => track.stop());
//         } catch (error) {
//             console.log(error);
//         }
//     }
//  }
//     useEffect(()=>{
//         if(video !== undefined && audio !== undefined) {
//             getUserMedia()
//         }
//     } ,[audio,video])


//     let gotMessageFromServer=(fromId,message)=>{
//         var signal=JSON.parse(message)
//         if(fromId !== socketIdRef.current ){
//             if (signal.sdp) {
//                 connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
//                     if (signal.sdp.type==="offer") {
//                         connections[fromId].createAnswer().then((description)=>{
//                              connections[fromId].setLocalDescription(description).then(()=>{
//                                 socketIdRef.current.emit("signal" ,fromId,JSON.stringify({"sdp":connections[fromId].localDescription}))
//                             }).catch(e=>console.log(e))
//                         }).catch(e=>console.log(e))
//                     }
//                 }).catch(e=>console.log(e))
//             }
//             if (signal.ice) {
//                 connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e))
//             }

//         }

//     }

//     let addMessage=()=>{

//     }

//     let connectToSocketServer=()=>{
//         socketRef.current=io.connect(server_url,{secure:false})
//         socketRef.current.on('signal', gotMessageFromServer)
//         socketRef.current.on('connect',()=>{
//             socketRef.current.emit('join-call',window.location.href)
//             socketIdRef.current=socketRef.current.id
//             socketRef.current.on("chat-message",addMessage)
//             socketRef.current.on("user-left",(id)=>{
//                 setVideo((videos)=>videos.filter((video)=>video.socketId !==id))
//             })

//             socketRef.current.on("user-joined",(id , clients)=>{
//                 clients.forEach((socketListId)=>{
//                     clients.forEach((socketListId)=>{
//                         connections[socketListId] =new RTCPeerConnection(peerConfigConnections)

//                         connections[socketListId].onicecandidate=(e)=>{
//                              if (e.candidate !=null) {
//                                 socketRef.current.emit("signal",socketListId, JSON.stringify({'ice':e.candidate}))
//                              }
//                         }

//                         connections[socketListId].onaddstream=(event)=>{
//                             let videoExists=videoRef.current.find(video=>video.socketId===socketListId)
//                             if (videoExists) {
//                                 setVideo(video=>{
//                                     const updateVideos= videos.map(video=>
//                                         video.socketId===socketListId ? {...video, stream:event.stream}: video
//                                     )
//                                       videoRef.current=updateVideos;
//                                       return updateVideos;
//                                 })
//                             }else{
//                               let newVideo={
//                                 socketId:socketListId,
//                                 stream:event.stream,
//                                 autoPlay:true,
//                                 playsinline:true
//                               }
//                               setVideos(videos=>{
//                                 const updatedVideos=[...videos, newVideo];
//                                 videoRef.current=updatedVideos
//                                 return updatedVideos;
//                               })

//                             }
//                         }

//                         if (window.localStream !==undefined  && window.localStream !==null) {
//                             connections[socketListId].addStream(window.localStream)
//                         }else{
//                             let blackSlience= (...args)=>new MediaStream([black(...args),silence()])
//                             window.localStream=blackSlience();
//                             connections[socketListId].addStream(Window.localStream);
//                         }
//                     })
//                     if (id===socketIdRef.current) {
//                         for(let id2 in connections){
//                             if(id2===socketIdRef.current)  continue

//                             try {
//                                 connections[id2].addStream(window.localStream)
//                             } catch (error) {
//                                 console.log(error);
//                             }
//                             connections[id2].createOffer().then((description)=>{
//                                 connections[id2].setLocalDescription(description)
//                                 .then(()=>{
//                                     socketRef.current.emit("signal",id2, JSON.stringify({"sdp": connections[id2].localDescription}))
//                                 })
//                                 .catch(e=> console.log(e))
//                             })
//                         }
//                     }
//                 })
//             })
//         })
//     }

//     let getMedia=()=>{
//         setVideo(videoAvailable)
//         setAudio(audioAvailable)
//         connectToSocketServer()
//     }

//     let connect=()=>{
//         setAskForUsername(false)
//         getMedia()

//     }


//   return (
//     <div className='tom'>
//       {askForUsername===true ?
//          <div className='tom2'>
//          <h1>Enter into Loby </h1>
//          <TextField id="outlined-basic" label="username" variant="outlined" value={username}  onChange={(e)=>setUsername(e.target.value)}/>
//          <Button variant="contained" onClick={connect}>Connect</Button>


//          <div className='tom0'>
//             <video id='aman' ref={localVideoRef} autoPlay muted></video>
//          </div>
//          </div> :<>
//         <div className='tom01'>
//         <video ref={localVideoRef} autoPlay muted></video>
//         </div>
//          {videos.map((video)=>{
//             <div key={video.socketId}>
//               <h2>{video.socketId}</h2>
//             </div>
//          })}
//          </>
//       }
//     </div>
//   )
// }

// export default VideoMeetComponent



import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/VideoMeet.css'
import { Badge, Button, IconButton, TextField } from '@mui/material';
import { io } from "socket.io-client";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';


const server_url = "http://localhost:8000"

const connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

const VideoMeetComponent = () => {
    const socketRef = useRef()
    const socketIdRef = useRef() // ✅ Holds only ID, not socket object

    const localVideoRef = useRef();
    const [videoAvailable, setVideoAvailable] = useState(true)
    const [audioAvailable, setAudioAvailable] = useState(true)
    const [video, setVideo] = useState([])
    const [audio, setAudio] = useState()
    const [screen, setScreen] = useState()
    const [showModel, setShowModel] = useState()
    const [screenAvailable, setScreenAvailable] = useState()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [newMessages, setNewMessages] = useState(0)
    const [askForUsername, setAskForUsername] = useState(true)
    const [username, setUsername] = useState("")
    const videoRef = useRef([])
    const [videos, setVideos] = useState([])

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true })
            setVideoAvailable(!!videoPermission)

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true })
            setAudioAvailable(!!audioPermission)

            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia)

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
                window.localStream = userMediaStream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = userMediaStream
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPermissions()
    }, [])

    const getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.log(error);
        }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            // ✅ Replaced deprecated addStream with addTrack
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream)
            })

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(() => {
                    // ✅ FIX: socketRef instead of socketIdRef
                    socketRef.current.emit('signal', id, JSON.stringify({ "sdp": connections[id].localDescription }))
                }).catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false)
            setAudio(false)
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (error) {
                console.log(error);
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                stream.getTracks().forEach(track => {
                    connections[id].addTrack(track, stream)
                })

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description).then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    }).catch(e => console.log(e))
                })
            }
        })
    }

    const silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop());
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia()
        }
    }, [audio, video])

    const gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message)
        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    // ✅ FIX: only create answer if SDP type is "offer"
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages)=>[
            ...prevMessages,
            {sender:sender,data:data}
            // {sender,data}
        ])
        if (socketIdSender!==socketIdRef.current) {
            // setMessages(prev => prev + 1)
            setNewMessages((prevMessages)=>prevMessages + 1)

        }

    }

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("user-left", (id) => {
                setVideos(videos => videos.filter((video) => video.socketId !== id));
                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
            });

            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((socketListId) => {
                    // ✅ Skip already existing connections
                    if (connections[socketListId]) return;

                    const peerConnection = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId] = peerConnection;

                    // ICE candidates
                    peerConnection.onicecandidate = (e) => {
                        if (e.candidate) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ ice: e.candidate }));
                        }
                    };

                    // Remote stream
                    peerConnection.ontrack = (event) => {
                        const [stream] = event.streams;

                        setVideos(prev => {
                            const exists = prev.some(v => v.socketId === socketListId);
                            if (exists) {
                                return prev.map(v => v.socketId === socketListId ? { ...v, stream } : v);
                            } else {
                                const newVideo = {
                                    socketId: socketListId,
                                    stream,
                                    autoPlay: true,
                                    playsinline: true
                                };
                                const updated = [...prev, newVideo];
                                videoRef.current = updated;
                                return updated;
                            }
                        });
                    };

                    // Local stream track addition
                    if (window.localStream) {
                        window.localStream.getTracks().forEach(track => {
                            peerConnection.addTrack(track, window.localStream);
                        });
                    } else {
                        const blackSilenceStream = new MediaStream([black(), silence()]);
                        window.localStream = blackSilenceStream;
                        blackSilenceStream.getTracks().forEach(track => {
                            peerConnection.addTrack(track, blackSilenceStream);
                        });
                    }
                });

                // Create offer if this is the new client
                if (id === socketIdRef.current) {
                    Object.keys(connections).forEach((id2) => {
                        if (id2 === socketIdRef.current) return;

                        const connection = connections[id2];

                        if (window.localStream) {
                            const senders = connection.getSenders();
                            window.localStream.getTracks().forEach(track => {
                                const alreadySent = senders.some(s => s.track && s.track.id === track.id);
                                if (!alreadySent) {
                                    connection.addTrack(track, window.localStream);
                                }
                            });
                        }

                        connection.createOffer()
                            .then(offer => connection.setLocalDescription(offer))
                            .then(() => {
                                socketRef.current.emit("signal", id2, JSON.stringify({ sdp: connection.localDescription }));
                            })
                            .catch(console.error);
                    });
                }
            });
        });
    };
    // const connectToSocketServer = () => {
    //     socketRef.current = io.connect(server_url, { secure: false })
    
    //     socketRef.current.on('signal', gotMessageFromServer)
    
    //     socketRef.current.on('connect', () => {
    //         socketRef.current.emit('join-call', window.location.href)
    //         socketIdRef.current = socketRef.current.id
    
    //         socketRef.current.on("chat-message", addMessage)
    
    //         socketRef.current.on("user-left", (id) => {
    //             setVideos(videos => videos.filter((video) => video.socketId !== id))
    //         })
    
    //         socketRef.current.on("user-joined", (id, clients) => {
    //             clients.forEach((socketListId) => {
    //                 connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
    
    //                 connections[socketListId].onicecandidate = (e) => {
    //                     if (e.candidate != null) {
    //                         socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': e.candidate }))
    //                     }
    //                 }
    
    //                 connections[socketListId].ontrack = (event) => {
    
    //                     const [stream] = event.streams
    //                     let videoExists = videoRef.current.find(video => video.socketId === socketListId)
    //                     if (videoExists) {
    //                         setVideos(videos => {
    //                             const updated = videos.map(video =>
    //                                 video.socketId === socketListId ? { ...video, stream } : video
    //                             )
    //                             videoRef.current = updated
    //                             return updated
    //                         })
    //                     } else {
    //                         let newVideo = {
    //                             socketId: socketListId,
    //                             stream,
    //                             autoPlay: true,
    //                             playsinline: true
    //                         }
    //                         setVideos(videos => {
    //                             const updatedVideos = [...videos, newVideo]
    //                             videoRef.current = updatedVideos
    //                             return updatedVideos
    //                         })
    //                     }
    //                 }
    
    //                 if (window.localStream !== undefined && window.localStream !== null) {
    //                     // Fix: Check if track already added before adding
    //                     const senders = connections[socketListId].getSenders()
    //                     window.localStream.getTracks().forEach(track => {
    //                         const senderExists = senders.find(s => s.track && s.track.id === track.id)
    //                         if (!senderExists) {
    //                             connections[socketListId].addTrack(track, window.localStream)
    //                         }
    //                     })
    //                 } else {
    //                     let blackSilence = (...args) => new MediaStream([black(...args), silence()])
    //                     window.localStream = blackSilence()
    //                     window.localStream.getTracks().forEach(track => {
    //                         connections[socketListId].addTrack(track, window.localStream)
    //                     })
    //                 }
    //             })
    
    //             if (id === socketIdRef.current) {
    //                 for (let id2 in connections) {
    //                     if (id2 === socketIdRef.current) continue
    
    //                     try {
    //                         // Fix: Check if track already added before adding
    //                         const senders = connections[id2].getSenders()
    //                         window.localStream.getTracks().forEach(track => {
    //                             const senderExists = senders.find(s => s.track && s.track.id === track.id)
    //                             if (!senderExists) {
    //                                 connections[id2].addTrack(track, window.localStream)
    //                             }
    //                         })
    //                     } catch (error) {
    //                         console.log(error)
    //                     }
    
    //                     connections[id2].createOffer().then((description) => {
    //                         connections[id2].setLocalDescription(description).then(() => {
    //                             socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
    //                         }).catch(e => console.log(e))
    //                     }).catch(e => console.log(e))
    //                 }
    //             }
    //         })
    //     })
    // }
    
    const getMedia = () => {
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer()
    }

    let routeTo=useNavigate()

    const connect = () => {
        setAskForUsername(false)
        getMedia()
    }
    let handleVideo=()=>{
        setVideo(!video)
    }
    let handleAudio=()=>{
        setAudio(!audio)
    }

    let getDisplayMediaSuccess=(stream)=>{
              try {
                window.localStream.getTracks().forEach(track=>track.stop())
              } catch (error) {
                console.log(error);
              }
              window.localStream=stream;
              localVideoRef.current.srcObject=stream

              for(let id in connections){
                     if (id===socketIdRef.current) continue;

                     connections[id].addStream(window.localStream)
                     connections[id].createOffer().then((description)=>[
                        connections[id].setLocalDescription(description)
                        .then(()=>{
                            socketRef.current.emit("signal", id,  JSON.stringify({"sdp": connections[id].localDescription}))
                        })
                        .catch((e)=>console.log(e))
                     ])
              }
              
        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (error) {
                console.log(error);
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

           getUserMedia();
        })
    }
    let getDisplayMedia=()=>{
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({video:true, audio:true})
                .then(getDisplayMediaSuccess)
                .then((stream)=>{})
                .catch((e)=>console.log(e))
            }
        }
    }

    useEffect(()=>{
        if (screen!==undefined) {
            getDisplayMedia()
        }
    },[screen])
    let  handleScreen=()=>{
        setScreen(!screen)
    }

    let sendMessage=()=>{
        socketRef.current.emit("chat-message",message, username);
        setMessage("")
    }
    let handleCall=()=>{
        try {
            let tracks=localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop())
        } catch (error) {
            
        }
        routeTo('/home')
    }

    return (
        <div className='tom'>
            {askForUsername === true ?
                <div className='tom2'>
                    <h1>Enter into Lobby</h1>
                    <TextField id="outlined-basic" label="username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Button variant="contained" onClick={connect}>Connect</Button>
                    <div className='tom0'>
                        <video id='aman' ref={localVideoRef} autoPlay muted></video>
                    </div>
                </div> :
                <div  className='meetVideoContainer'>
                    {showModel ?
                    <div className="chatContainer">
                        <div className='chatroom'>
                        <h1>Chat</h1>
                        <div className='chattingDisplay'>
                            { messages.length>0 ? messages.map((item, index)=>{
                                return(
                                    <div style={{marginBottom:'2px'}} key={index}>
                                        <p style={{fontWeight:'bold'}}>{item.sender}</p>
                                        <p>{item.data}</p>
                                    </div>
                                )
                            }):<></>}

                        </div>
                        <div className='chattingArea'>
                        <TextField value={message} onChange={(e)=>setMessage(e.target.value)} id="outlined-basic" label="Enter your chat" variant="outlined" />
                         <Button variant='contained' onClick={sendMessage}>Send</Button>
                        </div>
                        </div>
                    </div> :<></>}
                    <div className='buttonContainer'>
                        <IconButton onClick={handleVideo} style={{color:'white'}}>
                            {(video===true) ?<VideocamIcon/> : <VideocamOffIcon/>}
                        </IconButton>
                        <IconButton  style={{color:'red'}}>
                           <CallEndIcon onClick={handleCall}/>
                        </IconButton>
                        <IconButton  onClick={handleAudio} style={{color:'white'}}>
                          {audio===true ? <MicIcon/> : <MicOffIcon/>}
                        </IconButton >
                        {screenAvailable===true ?
                            <IconButton onClick={handleScreen} style={{color:'white'}}>
                                {screen===true ? <ScreenShareIcon/> : <StopScreenShareIcon/>

                                }
                            </IconButton> :
                            <></>
                        }
                        <Badge badgeContent={newMessages} max={999} color='secondary'>
                            <IconButton  onClick={()=>setShowModel(!showModel)} style={{color:'white'}}>
                                <ChatIcon/>
                            </IconButton>
                        </Badge>
                    </div>
                     <video className='meetUserVideo' ref={localVideoRef} autoPlay muted></video>
                     <div className='conferenceView'>
                    {videos.map((video) => (
                        <div key={video.socketId}>
                            <video
                                autoPlay
                                // playsInline
                                ref={(ref) => {
                                    if (ref) ref.srcObject = video.stream;
                                }}
                            ></video>
                        </div>
                    ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default VideoMeetComponent
