import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    setUser
} from "../actions/users.actions";
import axios from 'axios';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Avatar, Upload, message, Spin } from 'antd';
import { Container } from '@mui/system';
import { Icon } from '@iconify/react';
import { auth, storage } from '../firebase';
import { createUser } from '../api';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

const provider = new GoogleAuthProvider();
const { Title } = Typography;

const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function Account() {
    // const [user, setUser] = useState(null)
    const [name, setName] = useState("")
    const [backLogin, setBackLogin] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUpLoad, setImageUpLoad] = useState(null)
    const { user } = useSelector(
        (reduxData) => reduxData.userReducers
    );
    const [signUpButton, setSignUpButton] = useState(false);

    const dispatch = useDispatch(); // đăng kí dùng useDispatch



    const loginGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                

                 axios.post('http://localhost:8000/users',
                    {
                        "username": "user" + Math.floor(Math.random(0) * 9) + Math.floor(Math.random(0) * 9) + Math.floor(Math.random(0) * 9) + Math.floor(Math.random(0) * 9),
                        "loginType": "Google",
                        "uid": result.user.uid,
                        "avatar": result.user.photoURL,
                        "password": result.user.uid
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                    .then(function (response) {

                        setName("Xin chào " + result.user.displayName + "! Chúc Mừng bạn đến với GAMEDICE!")
                        dispatch(setUser(response.data));
                        // localStorage.setItem("user", response.data);


                    })
                    .catch(function (error) {

                        if (error.response.status === 401) {
                            setName("Chào Mừng " + result.user.displayName + " đã trở lại với GAMEDICE")
                            dispatch(setUser(error.response.data.data))
                        }
                    });


            })
            .catch((error) => {
                console.error(error);
            })
    }

    const logoutGoogle = () => {
        signOut(auth)
            .then(() => {
                dispatch(setUser(null));
            })
            .catch((error) => {
                console.error(error);
            })
    }



    useEffect(() => {
        onAuthStateChanged(auth, (result) => {
            //setUser(result)

        })
    })



    const onLogIn = (values) => {
        console.log('Success:', values);
        const data = {
            username: values.username,
            password: values.password
        }

        axios.get('http://localhost:8000/users',

            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {

                const in4User = response.data.find(item => item.username === values.username && item.password === values.password);
                console.log(in4User)
                dispatch(setUser(in4User))
                setName("Chào Mừng " + in4User.username + " đã trở lại với GAMEDICE");

            })
            .catch(function (error) {
                console.log(error)
                alert('Password hoặc username không đúng!')
            });


    };

    const onFinishFailed = (errorInfo) => {
        messageApi.open({
            type: 'error',
            content: 'lỗi',
        });
    };

    const onSignUp = async (values) => {
        // setSignUpButton(true)
          console.log('Success signup:', values);
          setImageUpLoad(values.dragger[0]?.originFileObj);
          if (imageUpLoad === null) return;
      
          const imageRef = ref(storage, `images/${imageUpLoad.name}`);
          const snapshot = await uploadBytes(imageRef, imageUpLoad);
          const url = await getDownloadURL(snapshot.ref);
          const imgURL = url;
      
          try {const response = await axios.post(
            'http://localhost:8000/users',
            {
              username: values.username,
              loginType: 'SignUp',
              uid:
                values.username +
                Math.floor(Math.random(0) * 9) +
                Math.floor(Math.random(0) * 9) +
                Math.floor(Math.random(0) * 9),
              avatar: imgURL,
              password: values.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          setName('Xin chào ' + response.data.username + '! Chúc Mừng bạn đến với GAMEDICE!');
          setSignUpButton(false)

          dispatch(setUser(response.data));
        //   localStorage.setItem("user", response.data);
        } catch (error) {
          console.log(error);
          messageApi.open({
            type: 'error',
            content: 'Không thể tạo tài khoản do username này đã tồn tại!',
          });
        }
      };
      

    const onSignUpFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.open({
            type: 'error',
            content: 'Không thể tạo tài khoản do chưa nhập đủ thông tin!',
        });
    };

    const logout = () => {

        dispatch(setUser(null));
        // window.location.reload();

    }



    return (
        <Container style={{ backgroundColor: 'pink', padding: '30px' }}>
            {contextHolder}
            {
                user ?
                    <>
                        <Title level={2} style={{textAlign:"center", color:"red"}}>{name}</Title>
                       
                            <>
                                <Title level={5} style={{textAlign:"center", color:"blue"}}>Thử vận may với Lucky Dice nhé!</Title>
                                <div style={{ marginTop: '30px', display:"flex", justifyItems:"center", justifyContent:"center", textAlign:"center"}}>
                                <Avatar style={{ marginTop: '30px', display:"flex", justifyItems:"center", justifyContent:"center", textAlign:"center"}}
                                    size={150}
                                    icon={<img src={user.avatar} alt='Avatar' />}
                                />
                                </div>
                                <Row style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                                    <Button type="primary" onClick={logout}>Đăng xuất</Button>
                                </Row>
                            </>
                        
                    </>
                    :
                    <Spin/>
            }
        </Container>
    )
}
export default Account;
