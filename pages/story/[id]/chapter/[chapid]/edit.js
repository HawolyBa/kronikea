import React from 'react'
import Link from 'next/link'
import dynamic from "next/dynamic";
import Head from 'next/head'
import { useRouter } from "next/router"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Form, Input, InputNumber, Checkbox, Tooltip, Select, Spin, Alert, Divider, Popconfirm } from 'antd'
import { EditorState } from 'draft-js';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { convertToHTML, convertFromHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useAuth } from '../../../../../database/auth'
import { useDeleteChapterMutation, useEditChapterMutation, useGetChapterInfoQuery } from '../../../../../database/reducers/stories';
import Button from '../../../../../components/common/Button';
import { capitalize } from '../../../../../utils/helpers';

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const { Option } = Select;

const EditChapter = () => {

  const auth = useAuth()
  const { query, push, replace } = useRouter()
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetChapterInfoQuery({ storyId: query.id, type: 'edit', chapterId: query.chapid }, { refetchOnMountOrArgChange: true })
  const [editChapter] = useEditChapterMutation()
  const [deleteChapter] = useDeleteChapterMutation()
  const [errors, setErrors] = React.useState({ body: '' })
  const [form] = Form.useForm()
  const postType = React.useRef(null)
  const sent = React.useRef(false)
  const [message, setMessage] = React.useState('')
  const [errmessage, setErrmessage] = React.useState('')
  const [changed, setChanged] = React.useState(false)
  const updated = React.useRef(false);
  const [titleDisabled, setTitleDisabled] = React.useState(false)
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty()
  );


  const onFinish = (values) => {
    if (!errors.body) {
      const d = {
        ...values,
        authorName: auth.user.username,
        userImage: auth.user.image,
        storyId: query.id,
        status: postType.current,
        title: titleDisabled ? '' : values.title,
        body: convertToHTML(editorState.getCurrentContent())
      }

      editChapter({ id: query.chapid, data: d })
        .unwrap()
        .then((res) => {
          setChanged(false)
          updated.current = true
          if (postType.current === 'published') {
            sent.current = true
            setTimeout(() => replace(`/story/${query.id}/chapter/${query.chapid}`)
              , 2000)
          } else {
            setMessage(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          updated.current = false
          setErrmessage(err)
          sent.current = false
        })
    }
  }

  const triggerDelete = () => {
    deleteChapter(query.chapid)
      .unwrap()
      .then(res => {
        if (res.message) {
          push(`/story/${query.id}`)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  const submit = t => {
    postType.current = t
    form.submit()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onChange = (e) => e.target.checked ? setTitleDisabled(true) : setTitleDisabled(false)

  const onFieldsChange = values => {
    setChanged(true)
    setMessage('')
    updated.current = false
  }

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };

  React.useEffect(() => {
    if (!isLoading && data?.info) {
      form.resetFields()
    }
  }, [data?.info, isLoading])

  React.useEffect(() => {
    if (data && query.chapid) {
      setEditorState(EditorState.createWithContent(convertFromHTML(data?.info?.body)))
      setTitleDisabled(data?.info?.numberOnly)
    }
  }, [data, query.chapid])

  React.useEffect(() => {
    if (editorState.getCurrentContent().getPlainText('\u0001').length < 500) {
      setErrors({ ...errors, body: "Must be at least 500 characters" });
    } else {
      setErrors({ ...errors, body: "" });
    }
  }, [editorState])

  React.useEffect(() => {
    if (error) {
      if (!error.storyExists) {
        push('/404')
      } else if (error.message && error.message === 'unauthorized')
        push('/unauthorized')
    }
  }, [error])

  React.useEffect(() => {
    if (message || errmessage) {
      sent.current = false
    }
  }, [message, errmessage])

  return (
    <>
      <Head>
        <title>{t('form:edit-chapter').charAt(0).toUpperCase() + t('form:edit-chapter').slice(1)} - Kronikea</title>
      </Head>
      <div className='add__chapter custom__form p-4 w-full'>
        <Spin spinning={auth.isLoading || isLoading || error || !data || error?.storyExists || error?.message === 'unauthorized'}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto">
            <div className="mb-6 text-center">
              <h2 className='text-2xl tracking-widest uppercase '>{t('form:edit-chapter')}</h2>
              <h3 className="mt-2 text-sm">
                <span className='capitalize'>{t('common:story')}</span>: <Link href={`/story/${data?.info?.storyId}`}><span className="cursor-pointer underline">{data?.info?.storyTitle}</span></Link>
              </h3>
              {data?.info?.status === 'published' && <Link href={`/story/${query.id}/chapter/${query.chapid}`} className='text-center flex items-center justify-center'>
                <FaLongArrowAltLeft />
                <span className="ml-2">{t('form:back-chapter')}</span>
              </Link>}
            </div>
            <Spin spinning={sent.current}>
              <Form name="editChapter"
                onFieldsChange={onFieldsChange}
                layout='vertical'
                form={form}
                style={{ maxWidth: "100%" }}
                initialValues={{
                  title: data?.info?.title,
                  summary: data?.info?.summary,
                  number: data?.info?.number,
                  numberOnly: data?.info?.numberOnly,
                  body: data?.info?.body,
                  characters: data?.info?.characters,
                  locations: data?.info?.locations
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">
                <div className="md:flex">
                  <div className="md:w-8/12 flex-1 w-full md:mr-3">
                    <Form.Item
                      label={capitalize(t('common:title'))}
                      name="title"
                      rules={[{ required: titleDisabled ? false : true, message: t('form:error-title') }, { max: 65 },]}
                    >
                      <Input disabled={titleDisabled} />
                    </Form.Item>
                  </div>
                  <div className="md:w-2/12 w-full md:mr-3">
                    <Form.Item
                      label={capitalize(t('form:number'))}
                      name="number"
                      rules={[{ required: true, message: t('form:error-number') }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </div>
                  <div className="md:w-2/12 w-full">
                    <Tooltip title={t('form:tooltip-number-only')}>
                      <Form.Item
                        label={capitalize(t('form:number-only'))}
                        name="numberOnly"
                        disabled={false}
                        valuePropName="checked"
                      >
                        <Checkbox onChange={onChange}></Checkbox>
                      </Form.Item>
                    </Tooltip>
                  </div>
                </div>
                <Form.Item
                  label={t('form:content').charAt(0).toUpperCase() + t('form:content').slice(1)}
                  name="body"
                  help={errors.body}
                  validateStatus={errors.body ? "error" : ''}
                >
                  <Editor
                    editorKey="editor"
                    defaultEditorState={editorState}
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    placeholder="Start writing your story..."
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class dark:text-slate-50"
                    toolbarClassName="toolbar-class"
                  />

                </Form.Item>
                <Divider className="dark:border-stone-700" />
                <div className="md:flex mt-4">
                  <div className="md:w-1/2 md:mr-3">
                    <Form.Item
                      name="characters"
                      label={capitalize(t('form:characters-in-chapter'))}
                    >
                      <Select mode="multiple"
                        allowClear>
                        {data?.info?.userCharacters?.map((chara) => (
                          <Option value={chara.id} key={chara.id}>
                            {`${chara.firstname} ${chara.lastname}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="md:w-1/2 md:mr-3">
                    <Form.Item
                      name="locations"
                      label={capitalize(t('form:locations-in-chapter'))}
                    >
                      <Select mode="multiple"
                        allowClear>
                        {data?.info?.userLocations?.map((loc) => (
                          <Option value={loc.id} key={loc.id}>
                            {loc.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                {
                  message && sent.current && <Alert message={message} type="success" />
                }
                {
                  errmessage && <Alert message={errmessage} type="error" />
                }
                <div className="flex justify-between mt-4">
                  <Popconfirm
                    title="Delete this chapter"
                    description="Do you really want to delete this chapter ? This action cannot be undone."
                    onConfirm={triggerDelete}
                    okText={t('common:yes')}
                    cancelText={t('common:no')}
                  >
                    <>
                      <Button type="button" textColor="text-red-500">
                        {t('form:delete')}
                      </Button>
                    </>
                  </Popconfirm>
                  <div>
                    {data?.info?.status === 'draft' &&
                      <Button textColor="text-zinc-800" color="bg-gray-200" onClick={() => submit('draft')} type="button">
                        {t('form:save-draft')}
                      </Button>}
                    <Button color="bg-primary" onClick={() => submit('published')} type="button" disabled={data?.info?.status === 'published' && !changed}>
                      {data?.info?.status === "published" ? t('form:save-changes') : t('form:post')}
                    </Button>
                  </div>
                </div>
              </Form>
            </Spin>
          </div>
        </Spin>
      </div>
    </>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["profile", 'form', 'auth', "common"]))
    },
  };
}

export const getStaticPaths = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default EditChapter