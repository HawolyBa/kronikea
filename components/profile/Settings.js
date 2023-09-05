import React from 'react';
import { Modal, Form, Tabs, Input, Divider, Alert, Tooltip, Checkbox } from 'antd';
import { IconContext } from "react-icons";
import { IoIosSettings } from "react-icons/io";

import UploadImage from '../../components/common/UploadImage'
import Button from '../../components/common/Button'
import Password from './Password';
import Popconfirm from 'antd/lib/popconfirm';

const { TextArea } = Input;

const Settings = ({ message, auth, success, errors, t, profile, changePassword, submit, showMessage }) => {
  const [form] = Form.useForm();
  const [banner, setBanner] = React.useState('')
  const [image, setImage] = React.useState('')
  const ref = React.useRef();

  const [changed, setChanged] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mode, setMode] = React.useState('settings')
  const [password, setPassword] = React.useState('')
  const handleCancel = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  const onFinishFailed = (values) => { console.log('Failed:', values) }

  const onSubmit = () => {
    if (form.getFieldValue('username')) {
      if (form.getFieldError().length === 0) {
        form.submit()
      }
    }
  }

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
    }
  }

  const onFieldsChange = values => setChanged(true)

  React.useEffect(() => {
    if (banner || image) setChanged(true)
  }, [banner, image])


  return (
    <>

      <Tooltip placement='bottom' title={t('profile:settings').charAt(0).toUpperCase() + t('profile:settings').slice(1)}>
        <div className="rounded-full p-2 backdrop-filter backdrop-blur-md bg-opacity-20 mr-2 cursor-pointer" onClick={showModal}>
          <IconContext.Provider value={{ size: "1.3em", color: "#24292f" }}>
            <IoIosSettings color='white' />
          </IconContext.Provider>
        </div>
      </Tooltip>
      <Modal
        maskClosable={true}
        closable
        onCancel={() => setIsModalOpen(false)}
        title={mode === 'settings' ? t('profile:profile-settings') : mode === 'delete' ? 'Delete your account' : t('profile:change-password')}
        open={isModalOpen}
        footer={mode === 'settings' && [
          (<Button textColor="text-zinc-800" key="back" onClick={() => {
            setMode('settings')
            showMessage.current = false
            setChanged(false)
            handleCancel()
          }} >{t('common:cancel')}</Button>), (<Button key="submit" color="bg-primary" disabled={!changed} onClick={() => onSubmit()} >{t('form:save')}</Button>)
        ]}>
        {
          mode === 'settings' ?
            <Form
              onKeyDown={handleKeyUp}
              ref={ref}
              form={form}
              onFieldsChange={onFieldsChange}
              name="settings"
              initialValues={{
                privateLikes: profile?.privateLikes,
                username: profile?.username,
                image: profile?.image,
                biography: profile?.biography,
                instagram: profile?.instagram,
                facebook: profile?.facebook,
                twitter: profile?.twitter,
                deviantart: profile?.deviantart,
                banner: profile?.banner
              }}
              layout='vertical'
              onFinish={(values) => submit(values)}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <div className="settings__modal mt-6">
                <Tabs defaultActiveKey="0" items={[
                  {
                    key: '0',
                    label: t('profile:username'),
                    children: (<div className="settings__modal__avatar py-6">
                      <h4 className="text-lg">{t('profile:change-username')}</h4>
                      <Divider className="dark:border-stone-700" />
                      <Form.Item name="username" label={t('profile:username')} rules={[{ required: true, message: t('auth:error-username') }, { max: 30, message: t('auth:error-username-len') }]}>
                        <Input />
                      </Form.Item>
                    </div>),
                  },
                  {
                    key: '1',
                    label: t('profile:image'),
                    children: (<div className="settings__modal__avatar py-4">
                      <h4 className="text-lg mb-3">Avatar</h4>
                      <UploadImage setImage={setImage} aspect='1' type='picture-circle' shape='round' form={form} name='image' image={profile?.image} />
                      <Divider className="dark:border-stone-700" />
                      <h4 className="text-lg mb-3">{t('profile:banner')}</h4>
                      <UploadImage setImage={setBanner} aspect='3' type='picture-card' shape="rect" form={form} name="banner" image={profile?.banner} />
                    </div>)
                  },
                  {
                    key: '2',
                    label: t('profile:about'),
                    children: (<div className="py-6">
                      <Form.Item name="biography" rules={[{ max: 150 }]}>
                        <TextArea rows={4} placeholder="Enter" />
                      </Form.Item>
                    </div>)
                  },
                  {
                    key: '3',
                    label: t('profile:social-links'),
                    children: (<div className="py-6">
                      <Form.Item name="facebook">
                        <Input addonBefore="https://www.facebook.com/" />
                      </Form.Item>
                      <Form.Item name="twitter">
                        <Input addonBefore="https://www.twitter.com/" />
                      </Form.Item>
                      <Form.Item name="instagram">
                        <Input addonBefore="https://www.instagram.com/" />
                      </Form.Item>
                      <Form.Item name="deviantart">
                        <Input addonBefore="https://www.deviantart.com/" />
                      </Form.Item>
                    </div>)
                  },
                  {
                    key: '4',
                    label: t('profile:security'),
                    children: (<div className="flex flex-col my-6">
                      <h4>{t('profile:privacy')}</h4>
                      <div className='flex justify-between'>
                        <span>{t('profile:make-private-tab')}</span>
                        <Form.Item valuePropName="checked" name="privateLikes">
                          <Checkbox />
                        </Form.Item>
                      </div>
                      <small>{t('profile:privacy-explained')}</small>
                      <Divider className="dark:border-stone-700" />
                      <div>
                        <Button color="bg-primary" onClick={() => setMode('password')}>
                          {t('profile:change-password')}
                        </Button>
                      </div>
                      <Divider className="dark:border-stone-700" />
                      <div>
                        <Button textColor="text-red-500" onClick={() => setMode('delete')} danger>
                          {t('profile:delete-account')}
                        </Button>
                      </div>
                    </div>)
                  }
                ]} />
                {showMessage.current && message.type === 'success' && <Alert message={message?.message} type="success" />}
                {showMessage.current && message.type === 'error' && <Alert message={message?.message} type="error" />}
              </div>
            </Form> :
            mode === 'delete' ?
              <>
                <h2>{t('profile:enter-password-to-delete')}: </h2>
                <div className="my-4">
                  <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
                  <p className='text-red-500 text-xs my-2'>{auth.errors.password}</p>
                  <Alert type="warning" description={t('profile:delete-explained')} />
                </div>

                <Button textColor="text-zinc-800" onClick={() => setMode('settings')}>{t('common:cancel')}</Button>
                <Popconfirm
                  okButtonProps={{ loading: false }}
                  title={t('profile:delete-account')}
                  description={t('profile:delete-confirm')}
                  onConfirm={() => auth.deleteAccount(password)}
                  okText={t('common:yes')}
                  cancelText={t('common:no')}
                >
                  <Button textColor="text-teal-700">{t('profile:confirm')}</Button>
                </Popconfirm>
              </>
              :
              <Password handleCancel={handleCancel} auth={auth} success={success} errors={errors} t={t} setMode={setMode} changePassword={changePassword} />
        }
      </Modal >
    </>
  )

}

export default Settings