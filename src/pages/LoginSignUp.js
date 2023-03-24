import { useEffect, useState } from 'react';
import axios from 'axios';

import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Avatar, Upload, message } from 'antd';
import { Container } from '@mui/system';
import { Icon } from '@iconify/react';
import auth from '../firebase';
import { createUser } from '../api';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

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
    const [user, setUser] = useState(null)
    const [name, setName] = useState('bạn')
    const [backLogin, setBackLogin] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();



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
                        setUser(response.data)

                    })
                    .catch(function (error) {

                        if (error.response.status === 401) {
                            setName("Chào Mừng " + result.user.displayName + " đã trở lại với GAMEDICE")
                            setUser(error.response.data.data)
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
                setUser(null);
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



    const onFinish = (values: any) => {
        console.log('Success:', values);



    };

    const onFinishFailed = (errorInfo: any) => {
        //console.log('Failed:', errorInfo);
        messageApi.open({
            type: 'error',
            content: 'lỗi',
          });
    };

    const onSignUp = (values: any) => {
        console.log('Success signup:', values);
        axios.post('http://localhost:8000/users',
            {
                "username": values.username,
                "loginType": "SignUp",
                "uid": values.username + Math.floor(Math.random(0) * 9) + Math.floor(Math.random(0) * 9) + Math.floor(Math.random(0) * 9),
                "avatar": values.dragger[0].uid,
                "password": values.password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {

                setName("Xin chào " + response.data.username + "! Chúc Mừng bạn đến với GAMEDICE!")
                setUser(response.data)

            })
            .catch(function (error) {
                messageApi.open({
                    type: 'error',
                    content: 'Không thể tạo tài khoản do username này đã tồn tại!',
                  });
                
            });
    };

    const onSignUpFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        messageApi.open({
            type: 'error',
            content: 'Không thể tạo tài khoản do chưa nhập đủ thông tin!',
          });
    };
    
    return (
        <Container style={{ backgroundColor: 'pink', padding: '30px' }}>
             {contextHolder}
            {
                user ?
                    <>
                        <Title level={2}>{name}</Title>
                        {!backLogin?
                        <>
                        <Title level={5}>Thử vận may với Lucky Dice nhé!</Title>
                        <Avatar style={{ marginTop: '30px' }}
                            size={150}
                            icon={<img src={user.avatar} alt='Avatar' />}
                        />
                        <Row style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" onClick={logoutGoogle}>Đăng xuất</Button>
                        </Row>
                        </>
                        :
                         <>
                         <Title level={5}>Hãy thử Đăng nhập với password!</Title>
                         <Row style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                             <Button type="primary" onClick={logoutGoogle}>Quay lại</Button>
                         </Row>
                         </>
}
                    </>
                    :
                    <>
                        <Title level={2}>START AND PLAY WITH US</Title>
                        <Divider style={{ borderColor: 'blue' }}>SignIn With</Divider>
                        <Row>
                            <Col span={8}>
                                <Icon icon="vaadin:google-plus-square" color="red" width="50" height="50" onClick={loginGoogle} />
                            </Col>
                            <Col span={8}>
                                <Icon icon="uiw:facebook" color="blue" width="50" height="50" />
                            </Col>
                            <Col span={8}>
                                <Icon icon="skill-icons:instagram" color="blue" width="50" height="50" />
                            </Col>
                        </Row>


                        <Divider style={{ borderColor: 'blue' }}>OR</Divider>
                        <Row>
                            <Col span={12}><Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="User Name"
                                    name="User Name"
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

                                <Form.Item valuePropName="fileList" getValueFromEvent={normFile}
                                label="Ảnh đại diện"
                                name="dragger"
                                rules={[{ required: true, message: 'Bạn chưa tải ảnh đại diện' }]}
                                >
                                    <Upload.Dragger name="files" action="/upload.do">
                                        <p className="ant-upload-drag-icon">
                                        <Icon icon="line-md:upload-loop" color="green" width="50" height="50" />
                                        </p>
                                        <p className="ant-upload-text">Click vào hoặc kéo thả file ảnh vào đây để tải lên</p>
                                    </Upload.Dragger>

                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: 'green' }}>
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
