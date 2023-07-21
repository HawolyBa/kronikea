import { Modal } from 'antd'

import Pagination from '../common/Pagination'

const Followers = ({ isOpen, show, title, data }) => {
  return (
    <Modal title={`${data?.length} ${title}`} open={isOpen} onCancel={show} onOk={show} closable={true} footer={null}>
      <div className="user_grid__card">
        <Pagination show={show} type="users" data={data} />
      </div>
    </Modal>
  )
}

export default Followers