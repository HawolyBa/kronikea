import { Modal, Form, Input, Alert } from 'antd';
import Link from 'next/link'

import Button from './Button'

const AddReview = ({ auth, modal, showModal, t, submitComment, onClose }) => {
  const [form] = Form.useForm();
  const onFinishFailed = (values) => console.log(values)

  const onClick = () => {
    form.submit()
    showModal(false)
  }

  return (
    <Modal cancelText={t('common:cancel')} title={t('character:add-review')} open={modal} onCancel={() => onClose(form)} footer={[
      (<Button key="back" textColor="text-zinc-800" color="bg-white" type="default" onClick={onClose.bind(null, form)} form={form} >
        {t('common:cancel')}
      </Button>),
      (<Button key="submit" color="bg-primary" disabled={auth && !auth?.user?.emailVerified || !form.getFieldError('content')} onClick={() => onClick()} form={form} htmlType="submit">
        {t('common:submit')}
      </Button>)
    ]}>
      <Form onFinishFailed={onFinishFailed} onFinish={submitComment.bind(null, form)} form={form} layout="vertical" name="feedback" initialValues={{ remember: false }} >
        <div className='my-4'>
          {auth && !auth?.user?.emailVerified &&
            <Alert message={t('common:verify-text')} type="error" showIcon action={
              <Link href='/auth/verify'>
                <Button textColor="text-slate-50" color="bg-secondary">
                  {t('common:verify-now')}
                </Button>
              </Link>
            } />
          }
        </div>
        <Form.Item rules={[{ required: true, message: "Cannot be empty" }, { max: 500, message: 'Cannot exceed 500 characters' }]} name="content">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddReview