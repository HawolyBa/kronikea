import React from 'react'
import Link from 'next/link'
import dynamic from "next/dynamic";
import Head from 'next/head'
import { useRouter } from "next/router"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Form, Input, InputNumber, Checkbox, Tooltip, Select, Spin, Alert, Divider } from 'antd'
import { EditorState } from 'draft-js';
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useAuth } from '../../../../database/auth'
import { useAddChapterMutation, useGetChapterInfoQuery } from '../../../../database/reducers/stories';
import { capitalize } from '../../../../utils/helpers';

import Button from '../../../../components/common/Button';

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const { Option } = Select;

const AddChapter = () => {

  const auth = useAuth()
  const { query, push } = useRouter()
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetChapterInfoQuery({ storyId: query.id, type: 'add' })
  const [addChapter] = useAddChapterMutation()
  const [errors, setErrors] = React.useState({ body: '' })
  const [form] = Form.useForm()
  const postType = React.useRef(null)
  const sent = React.useRef(false)
  const [message, setMessage] = React.useState('')
  const [errmessage, setErrmessage] = React.useState('')
  //Vérifier si le chiffre est déjà pris

  const [titleDisabled, setTitleDisabled] = React.useState(false)
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );

  const onFinish = (values) => {
    setErrmessage('')
    setMessage('')
    sent.current = true
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
      addChapter(d)
        .unwrap()
        .then((res) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          if (postType.current === 'published') {
            push(`/story/${query.id}/chapter/${res.chapid}`)
          } else if (postType.current === 'draft') {
            push(`/story/${query.id}`)
            setMessage(res.message)
          }
        })
        .catch(err => {
          sent.current = false
          setErrmessage(err)
        })
    }
  }

  const submit = t => {
    postType.current = t
    form.submit()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onChange = (e) => e.target.checked ? setTitleDisabled(true) : setTitleDisabled(false)

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };

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
        <title>{t('form:add-chapter').charAt(0).toUpperCase() + t('form:add-chapter').slice(1)} - Kronikea</title>
      </Head>
      <div className='add__chapter custom__form p-4 w-full'>
        <Spin spinning={auth.isLoading || isLoading || error || !data || sent.current}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto">
            <div className="mb-6 text-center">
              <h2 className='text-2xl tracking-widest uppercase '>{t('form:add-chapter')}</h2>
              <h3 className="mt-2 text-sm"><span className='capitalize'>{t('common:story')}</span>: <Link href={`/story/${data?.info?.storyId}`}><span className="cursor-pointer underline">{data?.info?.storyTitle}</span></Link></h3>
            </div>
            <Form name="addChapter"
              layout='vertical'
              form={form}
              style={{ maxWidth: "100%" }}
              initialValues={{
                title: '',
                summary: '',
                number: '',
                numberOnly: false,
                body: '',
                characters: [],
                locations: []
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
              <div className="flex justify-end mt-4">
                <Button onClick={() => submit('draft')} textColor="text-zinc-800" type="button" color="bg-gray-200">
                  {t('form:save-draft')}
                </Button>
                <Button onClick={() => submit('published')} type="button" color="bg-primary">
                  {t('form:post')}
                </Button>
              </div>
            </Form>
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

export default AddChapter