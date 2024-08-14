import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import sock from "socket.io-client";
import { Link } from "react-router-dom";
import { GoPaperclip } from "react-icons/go";

const socket = sock.connect("http://localhost:3001");
function Homechat() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    usertype: "",
    email: "",
    block: false,
  });

  const fileInput = useRef();
  const [imageUploaded, setImageUploaded] = useState("");
  const [search, setSearch] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);

  const userRef = useRef(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const loadScript = (url, callback) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
  
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = callback;
      }
  
      document.getElementsByTagName('head')[0].appendChild(script);
    };
  
    const googleTranslateScriptURL = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  
    loadScript(googleTranslateScriptURL, () => {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en', // Set default language
          },
          'google_translate_element'
        );
      };
    });
  }, []);

  const groupedMessages = useMemo(() => {
    return messages.reduce((accumulator, message) => {
      let otherUserId;
      if (message.sender === values.email) {
        otherUserId = message.receiver;
      } else {
        otherUserId = message.sender;
      }

      if (!accumulator[otherUserId]) {
        accumulator[otherUserId] = [];
      }

      accumulator[otherUserId].push(message);
      return accumulator;
    }, {});
  }, [messages, messages.length, values.email]);

  const sentMessages = useMemo(() => {
    return messages.reduce((accumulator, message) => {
      let otherUserId;
      if (message.sender === values.email) {
        otherUserId = message.receiver;
      } else {
        otherUserId = message.sender;
      }

      if (!accumulator[otherUserId]) {
        accumulator[otherUserId] = [];
      }

      accumulator[otherUserId].push(message);
      return accumulator;
    }, {});
  }, [messages, values.email]);

  const searchByEmail = async (search) => {
    if (search.length) {
      try {
        const { data } = await axios.post(
          "http://localhost:8080/auth/Emails", {search,}
        );
        console.log("Emails fetched:", data);
        setEmails(data);
      } catch (err) {
        console.error("Error fetching emails:", err);
      }
    }
  };
  useEffect(() => {
    socket.on("error", (msg) => {
      console.log(msg);
    });
    socket.on("profileUpdated", (user) => {
      setSelectedChat(user);
    });
    socket.on("userProfileUpdated", (user) => {
      setValues(user);
      localStorage.setItem("user", JSON.stringify(user));
    });

    socket.on("messageRecieved", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("allMessagesRecieved", (message) => {
      setMessages([...messages, ...message]);
    });
    return () => {
      
      socket.off();
    };
  }, []);

  useEffect(() => {
    userRef.current = JSON.parse(localStorage.getItem("user"));
    const timeOutId = setTimeout(() => searchByEmail(search), 500);
    return () => clearTimeout(timeOutId);
  }, [search]);

  useEffect(() => {
    if (userRef.current) {
      setValues({
        firstname: userRef.current.firstname,
        lastname: userRef.current.lastname,
        usertype: userRef.current.usertype,
        email: userRef.current.email,
        block: userRef.current.block,
      });
    }
  }, [userRef]);

  useEffect(() => {
    if (values.email) {
      socket.emit("joinUser", values.email);
    }
  }, [values]);

  const toggleChat = () => {
    socket.emit(
      selectedChat.block ? "unBlockUser" : "BlockUser",
      selectedChat.email
    );
  };
  const loadChats = (email) => {
    socket.emit("loadUserChat", email);
  };
  const sendMessage = () => {
    socket.emit("sendMessage", {
      email: selectedEmail,
      message,
      sender: values.email,
    });
    setMessages([
      ...messages,
      {
        receiver: selectedEmail,
        text: message,
        sender: values.email,
      },
    ]);
    
    setMessage("");
  };
  const fileSelectHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileData = event.target.result;
        const dataURL = `data:${file.type};base64,${btoa(fileData)}`; // Convert binary data to data URL
        socket.emit("fileUpload", {
          fileInfo: { filename: file.name, data: fileData },
          email: selectedEmail,
          sender: values.email,
        });
        setImageUploaded(dataURL);
        setMessages([
          ...messages,
          {
            receiver: selectedEmail,
            text: fileData,
            sender: values.email,
            isFile: true,
          },
        ]);
      };

      reader.readAsBinaryString(file);
    }
  };
  
  return (
    <div className="home-chat d-flex flex-column" style={{ height: "100vh" }}>
      <div id='google_translate_element'></div>
      <div className="d-flex justify-content-between">
        <h1>
          Welcome, {values.firstname} {values.lastname}!
        </h1>
        <p>
          ({values.usertype} profile) <Link to="/Login">Logout</Link>
        </p>
      </div>
      <div className="d-flex gap-5 flex-grow-1">
        <div className="mainChat flex-grow-1 p-3 bg-success-subtle rounded-4 d-flex flex-column justify-content-between">
          <div className="">
            {/* Display selected email */}
            {(selectedEmail && (
              <div className="d-flex justify-content-between">
                <p>{selectedEmail}</p>
                {(values.usertype === "practitioner" && (
                  //Display block/unblock button for practitioners
                  <div style={{ cursor: "pointer" }}
                  className="bg-danger-subtle p-2 rounded-3"
                  onClick={toggleChat}>
                    {selectedChat.block ? "enable" : "disable"}
                  </div>
                )) || ""} 
                  </div> 
                  )) || ""}
            {values.usertype === "patient" ? (
              //Display messages for patients
              <div className="">
                {groupedMessages[selectedEmail] &&
                  groupedMessages[selectedEmail].map((item) => (
                    <div
                      className={`d-flex flex-column w-full ${
                        item.sender === values.email ? "align-items-end" : "" }`}>
                      <div className={`bg-success my-2 p-3 col-md-6 
                      ${item.sender === values.email ? "messageSent" : "message"}`}>
                        {(item.isFile && (
                          <img style={{ width: "450px", height: "350px" }} src={
                              item.id ? `http://localhost:8080/${item.text}` : imageUploaded} alt=""/>
                        )) || item.text}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              // Display messages for practitioners
              <div className="">
                {sentMessages[selectedEmail] &&
                  sentMessages[selectedEmail].map((item) => (
                    <div
                      className={`d-flex flex-column w-full ${
                        item.sender === values.email ? "align-items-end" : ""}`}>
                      <div className={`bg-primary my-2 p-3 col-md-6 
                      ${item.sender === values.email ? "messageSent" : "message"
                        }`}>
                        {(item.isFile && (
                          <img style={{ width: "450px", height: "350px" }} 
                          src={item.id ? `http://localhost:8080/${item.text}` : imageUploaded}
                            alt=""/>)) || item.text}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Message input*/}
          <div className="d-flex w-100 gap-3">
            <input type="text" className="flex-grow-1 rounded-5 py-2 px-3"
              onChange={(e) => {setMessage(e.target.value);}}
              value={message}
              disabled={values.block}/>
              {/* File upload button for practitioners */}
            {(values.usertype === "practitioner" && (
              <div style={{ display: "grid" }}>
                <button className="border-0 bg-transparent" id="plus"
                  onClick={() => {fileInput.current.click();}}>
                  <GoPaperclip size={18} />
                </button>
                <input ref={fileInput} id="selectImage" hidden type="file"
                  onChange={fileSelectHandler}/>
              </div>
              )) || ""}
              {/*Send Button*/}
            <button disabled={values.block|| message.trim().length === 0} onClick={sendMessage}
              className="bg-success text-white px-4 border-0 rounded-3"> Send </button>
          </div>
        </div>
        <div className="sidebar p-4 col-md-3 bg-body-secondary rounded-4">
          {/* Email input and search for practitioners */}
          {values.usertype === "practitioner" ? (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <label className="Email-user-label" htmlFor="emailUser">
                  {" "} Create or Find an existing chat: {" "} </label>
                <input id="emailUser" className="p-2 w-100 my-3 rounded-4" type="text"
                placeholder="Search for patient email"
                  onChange={(event) => {setSearch(event.target.value);}}
                  value={search}/>
                <div className="w-100">
                  {/* List of email search results */}
                  {(emails.length && emails.map((item) => (
                      <div className="my-2" onClick={() => {
                        loadChats(item.email); 
                        setSelectedChat(item);
                        setSelectedEmail(item.email);
                        }}
                        key={item.email}
                        style={{ cursor: "pointer" }}>
                        {item.email}
                      </div>
                    ))) || ""}
                </div>
              </div>
            </>
          ) : 
          (
            // List of active chats for patients
            <div className="">
              {Object.keys(groupedMessages).length > 0
                ? Object.keys(groupedMessages).map((item) => (
                    <div className="bg-success-subtle p-3 rounded-3" onClick={() => {setSelectedEmail(item);}}
                      style={{ cursor: "pointer" }} key={item.id}>
                      {item}
                    </div>
                  )) : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homechat;
