import React, { useState, useEffect } from "react";
import logo from "../../assets/img/logo.svg";
import Greetings from "../../containers/Greetings/Greetings";
import "./Popup.css";

const Popup = () => {
  const [API_KEY, setApiKey] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["openai_api_key"]).then(({ openai_api_key }) => {
      setApiKey(openai_api_key);
    });
  }, []);

  return (
    <div className="container">
      <form>
        <div className="mb-3">
          <label htmlFor="apiKey" className="form-label">
            API KEY
            <input
              type="text"
              className="form-control"
              id="apiKey"
              name="apiKey"
              placeholder="OPEN AI api key"
              value={API_KEY}
              onChange={(e) => {
                setApiKey(e.target.value);
                chrome.storage.local.set({ openai_api_key: e.target.value }); //  Persist the api key in the chrome local storage
              }}
            />
          </label>
          <div id="api_key_help" className="form_text">
            Insert your OpenAI api key
          </div>
        </div>
      </form>
    </div>
  );
};

export default Popup;
