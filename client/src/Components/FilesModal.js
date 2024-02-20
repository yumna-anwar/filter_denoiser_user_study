import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonService from "../Services/Common/CommonService";
import { toast } from "react-toastify";

const FilesModal = ({ isOpen, onClose, participantId }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {

        const fetchFiles = async () => {
          //toast.error("IN FETCH");
            try {
                const id = participantId;
                const response = await CommonService.GetAllFilesId(id);

                if (response.success){
                  toast.success(response.message);
                  setFiles(response.fileData);
                } else {
                  toast.error('Failed to fetch files');
                  setFiles([]);
                }

            } catch (error) {
                toast.error(error.message);
                console.error('Error fetching files:', error);
            }
        };

        if (isOpen && participantId) {
            fetchFiles();
        }
    }, [isOpen, participantId]);

    if (!isOpen) return null;

    return (
      <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f9f9f9',
            padding: '40px',
            zIndex: 1000,
            overflowY: 'auto',
            maxHeight: '80%',
            width: '50%',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd'
            }}>
            <button onClick={onClose} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}>
              &times; {/* Stylish close button */}
            </button>
            <h2 style={{ marginTop: '0', textAlign: 'center' }}>LIST OF USER FILES</h2> {/* Optional: Add a title */}
            <ul style={{
              listStyleType: 'none',
              padding: '0'
            }}>
              {files.map((filename, index) => (
                <li key={index} style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee'
                }}>
                  {filename}
                </li>
              ))}
            </ul>
            </div>
    );
};

export default FilesModal;
