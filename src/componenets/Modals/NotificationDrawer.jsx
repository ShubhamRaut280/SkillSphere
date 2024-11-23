import React from "react";
import styled from "styled-components";
import NotificationCard from "../Cards/NotificationCard";

const NotificationDrawer = ({ isOpen, toggleDrawer }) => {
  return (
    <DrawerWrapper isOpen={isOpen}>
      <div className="drawer">
        <div className="header">
          <h2>Notifications</h2>
          <button className="close-btn" onClick={toggleDrawer}>
            ✕
          </button>
        </div>
        <div className="content">
          <ul>
            <li>
              <NotificationCard/>
            </li>
            <li>
              <NotificationCard/>
            </li>
            <li>
              <NotificationCard/>
            </li>
          </ul>
        </div>
      </div>
    </DrawerWrapper>
  );
};

const DrawerWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-50%")};
  width: 50%;
  height: 100%;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1000;

  .drawer {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }

    .content {
      padding: 1rem;
      overflow-y: auto;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
`;

export default NotificationDrawer;
