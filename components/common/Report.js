import React from 'react'
import Link from 'next/link'
import { Modal, Button, Form, Input, Select, message } from 'antd'
import { AiFillFlag } from 'react-icons/ai';
import { useTranslation } from 'next-i18next'

import { useReportMutation } from '../../database/reducers/profile'

import UploadImage from './UploadImage'

// TODO - ADD A MESSAGE OF THANKS AFTER SENT
// TODO - ADD TRANSLATIONS

const Report = ({ auth, routeId, type, authorId, authorName }) => {
  const [open, setOpen] = React.useState(false)
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [form] = Form.useForm()
  const [report] = useReportMutation()
  const { t } = useTranslation()

  const onSubmit = async values => {
    await report({
      ...values,
      author: authorId,
      authorId: authorName,
      plaignantName: auth.user ? auth.user.username : '',
      plaignant: auth.user ? auth.user.uid : '',
      itemId: routeId,
      type: type,
    })
      .unwrap()
      .then((res) => {
        setIsDisabled(true)
        message.success(res.message)
        setOpen(false)
        form.resetFields()
      })
      .catch((err) => console.log(err))
  }
  const onFinishFailed = values => {
    console.log(values)
  }

  const onClick = () => {
    if (form.getFieldError().length === 0) {
      form.submit()
    }
  }
  return (
    <>
      <Modal
        maskClosable
        closable={true}
        open={open}
        onCancel={() => setOpen(false)}
        title="Send a report"
        footer={[
          (<Button key="back" onClick={() => setOpen(false)}>Cancel</Button>),
          (<Button onClick={() => onClick()} htmlType="submit" key="submit" disabled={isDisabled}>Send</Button>),
        ]}
      >
        <div className='mt-6'>
          <Form initialValues={{ content: '', image: '', nature: '' }} form={form} layout="vertical" onFinish={onSubmit} onFinishFailed={onFinishFailed}>
            <Form.Item name="nature" rules={[{ required: true, message: 'Please pick a choice' }]} label={`What is the issue with this content ?`}>
              <Select placeholder="Select">
                <Select.Option value={'offensive'}>Offensive content</Select.Option>
                <Select.Option value={'stolen'}>Stolen content</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="content" label="Describe the issue (optional)">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="image" label="Join an image (optional)">
              <UploadImage image={null} aspect={1} shape="rect" name="image" form={form} type="picture-card" />
            </Form.Item>
          </Form>
          <Link className='text-xs' href='/rules'>
            Learn more about our reporting system
          </Link>
        </div>
      </Modal>
      {type === 'character-comment' || type === 'chapter' ?
        <p className="dark:text-slate-50 cursor-pointer dark:slate-100 text-xs" onClick={() => {
          setOpen(true)
          setIsDisabled(false)
        }}><i className="fas fa-flag"></i> {t('common:report')}</p>
        :
        <div className=" cursor-pointer ml-4 text-xl" onClick={() => {
          setOpen(true)
          setIsDisabled(false)
        }}>
          <AiFillFlag />
        </div>
      }
    </>
  )
}

export default Report