import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { GoSearch } from 'react-icons/go';
import Logo from '../img/Logo.png';
import { Link } from 'react-router-dom';
import UserCard from './UserCard';

const HeaderComponent = styled.header`
  border-bottom: 2px solid #d9d9d9;
  box-shadow: 2px 1px #d9d9d9;
  height: 47px;
  background: rgb(248, 249, 249);
  > div {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-around;
    margin: 0 auto;
    width: 1400px;

    & .header-container {
      width: 100%;
      height: 100%;
      display: flex;
      margin: 0 auto;
      align-items: center;
    }

    & .logo-anchor {
      padding: 0 8px;
      height: 100%;
      display: flex;
      align-items: center;
      background-color: transparent;
    }

    & .logo {
      background-image: url(${Logo});
      background-size: 100% 100%;
      width: 150px;
      height: 30px;
    }

    & .search-form {
      padding: 0 8px;
      display: flex;
      align-items: center;
      flex-shrink: 10000;
      flex-grow: 1;
    }

    & .search-group {
      position: relative;
      flex-grow: 1;
    }

    & .search-input {
      display: block;
      margin: 0;
      padding: 5px;
      padding-left: 32px;
      width: 100%;
    }

    & .search-icon {
      right: auto;
      left: 0.7em;
      position: absolute;
      top: 50%;
      margin-top: -6px;
    }
  }
`;

const Topbar = styled.div`
  padding: 1.5px;
  background: #f48225;
  margin-bottom: 3px;
`;

function Header() {
  const searchHandler = () => {};

  const isLogin = true;
  return (
    <>
      <Topbar />
      <HeaderComponent>
        <div>
          <div className="header-container">
            <Link to="/">
              <div className="logo-anchor">
                <span className="logo"></span>
              </div>
            </Link>

            <form className="search-form" onSubmit={searchHandler}>
              <div className="search-group">
                <GoSearch className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            </form>
            {isLogin ? (
              <>
                <UserCard />
                <Button>Log out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    data={{
                      background: '#e1ecf4',
                      color: '#315877',
                      hovercolor: '#B3D3EA',
                      activecolor: '#B3D3EA',
                    }}
                  >
                    Log in
                  </Button>
                </Link>

                <Link to="/sign">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </HeaderComponent>
    </>
  );
}

export default Header;
