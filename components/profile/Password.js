import React from 'react'
import { Form, Input, message, Divider, Alert } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";

import Button from '../common/Button'

const Password = ({ handleCancel, auth, success, errors, changePassword, setMode, t }) => {
  const [form] = Form.useForm();
  const onFinishFailed = (values) => { }
  const showMessage = React.useRef(false)

  React.useEffect(() => {
    if (success) {
      message.success(t('auth:change-password-success'))
      form.resetFields();
    }
  }, [success])

  const setUpPassword = (values) => {
    auth.setupPassword(values.newPassword)
  }

  return (
    <div className="mt-6">
      <div onClick={() => setMode('settings')} className='cursor-pointer flex items-center'>
        <FaLongArrowAltLeft /> <span className='ml-2'>{t('profile:back-settings')}</span>
      </div>
      <Divider className="dark:border-stone-700" />
      {auth.isGoogleOnly && (
        <div className="mb-5">
          <span className="flex items-center">{t('profile:auth-method')}:  <FcGoogle style={{ margin: '0 10px' }} /> {t('profile:google-user')}</span>
          {/* <p>{t('profile:set-password')} ?</p> */}
        </div>
      )}
      {!auth.isGoogleOnly &&
        <Form form={form}
          name="password"
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          layout='vertical'
          onFinish={auth.isGoogleOnly ? setUpPassword : changePassword}
          onFinishFailed={onFinishFailed}
          initalValues={{ remember: false }}
          autoComplete="off">


          <Form.Item
            label={t('profile:old-password')}
            name="oldPassword"
            help={errors.password}
            validateStatus={errors.password ? "error" : ''}
            rules={[{ required: true, message: t('auth:error-password') }]}
          >
            <Input.Password name="oldPassword" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Form.Item name="newPassword" label={t('profile:new-password')}>
            <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={t('profile:confirm-password')}
            help={errors.confirmPassword}
            validateStatus={errors.confirmPassword ? "error" : ''}
            rules={[{ required: true, message: t('auth:error-confirm-password') }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    `${t('profile:unmatched-password')}!`
                  )
                );
              },
            }),]}
          >
            <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <div className="flex justify-between">
            <Button textColor="text-zinc-800" onClick={() => handleCancel()}>{t('common:cancel')}</Button>
            <Button color="bg-primary" className='bg-primary text-slate-50 hover:text-slate-100 capitalize' onClick={() => form.submit()}>{t('profile:update')}</Button>
          </div>
          {showMessage.current && data?.data?.message && <Alert message={data?.data?.message} type="success" />}
          {showMessage.current && data?.data?.error && <Alert message={data?.data?.error} type="success" />}
        </Form>}
    </div>
  )
}

export default Password