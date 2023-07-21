// import React from 'react'
// import Image from 'next/image'
// import { Upload, message, Form, Input } from "antd";
// import { LoadingOutlined, PlusOutlined, StarOutlined } from "@ant-design/icons";

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });


// function beforeUpload(file) {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// }

// const UploadImage = ({ form, image, name }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [loading, setLoading] = React.useState(false);
//   const [imageUrl, setImageUrl] = React.useState(image ? image : "");

//   const handleCancel = () => setPreviewOpen(false);

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//   };

//   const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
//   const uploadButton = (
//     <div>
//       <PlusOutlined />
//       <div
//         style={{
//           marginTop: 8,
//         }}
//       >
//         Upload
//       </div>
//     </div>
//   );

//   const handleChange = (info) => {
//     if (info.file.status === "uploading") {
//       setLoading(true);
//       return;
//     }
//     if (info.file.status === "done") {
//       form.setFieldsValue({ [name]: info.file.originFileObj });
//       // setImage(info.file.originFileObj);
//       getBase64(info.file.originFileObj, (imageUrl) => {
//         setLoading(false);
//         setImageUrl(imageUrl);
//       });
//     }
//   };

//   const uploadButton = (
//     <div>
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );
//   return (
//     <>
//       <Form.Item name={name} label="Upload a new image">
//         <Upload
//           showUploadList={{
//             showRemoveIcon: true,
//             removeIcon: <StarOutlined />,
//           }}
//           listType="picture-card"
//           className="cover-uploader"
//           beforeUpload={beforeUpload}
//           onChange={handleChange}
//           maxCount={1}
//           status="success"
//         >
//           {imageUrl ? (
//             <div className="w-full h-full relative">
//               <img
//                 src={imageUrl}
//                 alt="image"
//                 className='w-full h-full object-cover'
//               />
//             </div>
//           ) : (
//             uploadButton
//           )}
//         </Upload>
//       </Form.Item>
//       <Form.Item
//         label="Image Copyright"
//         name="imageCopyright"
//         rules={[
//           {
//             required: form.getFieldValue(name) ? true : false,
//             message: "An image copyright is required",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//     </>
//   );
// };

// export default UploadImage;
import React from "react";
import { useState } from 'react';
import { Upload, message, Form } from 'antd';
import ImgCrop from 'antd-img-crop';

const UploadImage = ({ setImage, name, form, image, shape, type, aspect }) => {
  const [fileList, setFileList] = useState(image ? [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: image,
    },
  ] : []);

  React.useEffect(() => {
    if (image) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: image,
      }])
    }
  }, [image])

  function beforeUpload(file) {

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const onChange = ({ fileList: newFileList }) => {
    const isJpgOrPng = newFileList[0].type === "image/jpeg" || newFileList[0].type === "image/png";
    const isLt2M = newFileList[0].size / 1024 / 1024 < 2;
    if (isJpgOrPng && isLt2M) {
      setFileList(newFileList);
      form.setFieldsValue({ [name]: newFileList[0] ? newFileList[0].originFileObj : '' });
      setImage(newFileList[0]);
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Form.Item name={name} >
      <ImgCrop aspect={aspect} rotate shape={shape}>
        <Upload
          beforeUpload={beforeUpload}
          maxCount={1}
          listType={type}
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 5 && <span className="dark:text-slate-50 text-3xl">+</span>}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};
export default UploadImage;