import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { auth, storage } from '../firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';

import { setUser } from "../actions/users.actions";

import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Avatar, Upload, message, Spin } from 'antd';
import { Container } from '@mui/system';
import { Icon } from '@iconify/react';

const provider = new GoogleAuthProvider();
const { Title } = Typography;

const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function LoginSignUp() {
    const { user } = useSelector((reduxData) => reduxData.userReducers);
    const [name, setName] = useState("Mừng bạn đến với GAMEDICE")
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUpLoad, setImageUpLoad] = useState(null)
    const [signUpButton, setSignUpButton] = useState(false);

    // đăng kí dùng useDispatch
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, (result) => {
            //firebase         
        })

        let readyUser = localStorage.getItem('persist:root');
        const dataUser = (JSON.parse(readyUser)).userReducers;
        const uerObj = JSON.parse(dataUser);
        console.log(uerObj.user)
        if (uerObj === null) {
            return undefined;
        }
        dispatch(setUser(uerObj.user));
    }, [dispatch])


    // Đăng nhập bằng Google 
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
                        let theUser = JSON.stringify(response.data);
                        localStorage.setItem('dataUser', theUser);

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

    //Đăng nhập bằng password
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
                let theUser = JSON.stringify(in4User);
                localStorage.setItem('dataUser', theUser);

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

    //Đăng kí người dùng
    const onSignUp = async (values) => {
        // setSignUpButton(true);
        console.log('Success signup:'+ values);
        console.log(values.dragger);
        setImageUpLoad(values.dragger[0]?.originFileObj);

        const imageRef = ref(storage, `images/${imageUpLoad.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpLoad);
        const url = await getDownloadURL(snapshot.ref);
        const imgURL = url;
        if (imageUpLoad === null) return;

        try {
            const response = await axios.post(
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
            // setSignUpButton(false)
            let theUser = JSON.stringify(response.data);
            localStorage.setItem('dataUser', theUser);
            dispatch(setUser(response.data));
           
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'Không thể tạo tài khoản do username này đã tồn tại!',

            });
            // setSignUpButton(false)
        }
    };


    const onSignUpFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.open({
            type: 'error',
            content: 'Không thể tạo tài khoản do chưa nhập đủ thông tin!',
        });
    };

    const logoutAccount = () => {
        dispatch(setUser(null));
        // setSignUpButton(true)
        // window.location.reload();

    }



    return (
        <Container style={{ backgroundColor: 'pink', padding: '30px' }}>
            {contextHolder}
            {
                user ?
                    <>
                        <Title level={2} style={{ textAlign: "center", color: "red" }}>{name}</Title>

                        <>
                            <Title level={5} style={{ textAlign: "center", color: "blue" }}>Thử vận may với Lucky Dice nhé!</Title>
                            <div style={{ marginTop: '30px', display: "flex", justifyItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <Avatar style={{ marginTop: '30px', display: "flex", justifyItems: "center", justifyContent: "center", textAlign: "center" }}
                                    size={150}
                                    icon={<img src={user.avatar} alt='Avatar' />}
                                />
                            </div>
                            <Row style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                                <Button type="primary" onClick={logoutAccount}>Đăng xuất</Button>
                            </Row>
                        </>

                    </>
                    :
                    <>
                        <Title style={{ display: "flex", justifyContent: "center" }} level={2}>START AND PLAY WITH US</Title>
                        <Divider style={{ borderColor: 'blue' }}>SignIn With</Divider>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Icon icon="vaadin:google-plus-square" color="red" width="50" height="50" onClick={loginGoogle} />
                           
                        </Row>


                        <Divider style={{ borderColor: 'blue' }}>OR</Divider>
                        <Row>
                            <Col span={12}><Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                onFinish={onLogIn}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="User Name"
                                    name="username"
                                    rules={[

                                        {
                                            required: true,
                                            message: 'Please input your User Name!',
                                        },
                                    ]}

                                >
                                    <Input placeholder="Insert your User Name" />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password placeholder="Insert your password" />
                                </Form.Item>

                                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        Log In
                                    </Button>
                                </Form.Item>
                            </Form></Col>
                            <Col span={12}><Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                onFinish={onSignUp}
                                onFinishFailed={onSignUpFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="User Name"
                                    name="username"
                                    rules={[

                                        {
                                            required: true,
                                            message: 'Please input your User Name!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Insert your User Name" />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password placeholder="Insert your password" />
                                </Form.Item>

                                <Form.Item valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    label="Ảnh đại diện"
                                    name="dragger"
                                    rules={[{ required: true, message: 'Bạn chưa tải ảnh đại diện' }]}
                                >
                                    <Upload.Dragger name="files" action="/upload.do" maxCount={1} accept=".jpg,.png,.gif">
                                        <p className="ant-upload-drag-icon">
                                            <Icon icon="line-md:upload-loop" color="green" width="50" height="50" />
                                        </p>
                                        <p className="ant-upload-text">Click vào hoặc kéo thả file ảnh vào đây để tải lên</p>
                                    </Upload.Dragger>

                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: 'green' }} disabled={signUpButton}>
                                        Sign Up
                                    </Button>
                                </Form.Item>
                            </Form></Col>
                        </Row>
                    </>
            }
        </Container>
    )
}
export default LoginSignUp;
