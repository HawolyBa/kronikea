import { Row, Col, Form, Select, Input } from "antd";
import React from "react";

import CharacterCard from "../common/CharacterCard";

const { Option } = Select;

const Relatives = ({ character, characters, form, t, capitalize }) => {
  const [relations, setRelations] = React.useState([]);
  const [currentChar, setCurrentChar] = React.useState("");
  const [currentRel, setCurrentRel] = React.useState("");
  const [selectedCharacters, setSelectedCharacters] = React.useState([]);

  const [selectedArr, setSelectedArr] = React.useState(
    character ? character.relatives.map((c) => c.character_id) : []
  );

  const [showErrorRel, setShowErrorRel] = React.useState(false);
  const [showErrorChar, setShowErrorChar] = React.useState(false);

  const addRelation = () => {
    let newRelations = [...relations];
    if (currentChar && currentRel) {
      newRelations = [
        ...newRelations,
        { character_id: currentChar, relation: currentRel },
      ];
      setSelectedCharacters([
        ...selectedCharacters,
        {
          ...characters.find((c) => c.id === currentChar),
          relation: currentRel,
        },
      ]);
      setSelectedArr([...selectedArr, currentChar]);
      form.setFieldsValue({ relatives: newRelations });
      setRelations(newRelations);
      setCurrentChar("");
      setCurrentRel("");
      setShowErrorChar(false);
      setShowErrorRel(false);
    }

    if (!currentRel) {
      setShowErrorRel(true);
    }

    if (!currentChar) {
      setShowErrorChar(true);
    }
  };

  React.useEffect(() => {
    if (character && characters?.length > 0) {
      setRelations(character?.relatives)
      setSelectedCharacters(
        character?.relatives.map((c) => ({
          firstname: characters?.find((char) => char.id === c.character_id)?.firstname,
          lastname: characters?.find((char) => char.id === c.character_id)?.lastname,
          image: characters?.find((char) => char.id === c.character_id)?.image,
          id: characters?.find((char) => char.id === c.character_id)?.id,
          relation: c?.relation,
        }))
      );
    }
  }, [character, characters]);

  const removeCharacter = (id) => {
    setSelectedCharacters(selectedCharacters.filter((c) => c.id !== id));
    setSelectedArr(selectedArr.filter((c) => c !== id));
    setRelations(relations.filter((c) => c.character_id !== id));
    form.setFieldsValue({
      relatives: relations.filter((c) => c.character_id !== id),
    });
  };

  return (
    <>
      <h3 className="dark:text-slate-50 text-lg capitalize">{t('form:relationships')}</h3>
      <Row gutter={[24, 12]} align="middle">
        <Col md={11} sm={24} xs={24}>
          <Form.Item label={capitalize(t('form:select-character'))}>
            <Select value={currentChar} onChange={(val) => setCurrentChar(val)}>
              <Option value="none" disabled>
                {capitalize(t('form:select-character'))}
              </Option>
              {characters
                ?.filter((c) => !selectedArr.includes(c.id))
                .map((c) => (
                  <Option
                    key={c.id}
                    value={c.id}
                  >{`${c.firstname} ${c.lastname}`}</Option>
                ))}
            </Select>
            {showErrorChar && (
              <div className="ant-form-item-explain ant-form-item-explain-error">
                <div role="alert">{capitalize(t('form:character-required'))}</div>
              </div>
            )}
          </Form.Item>
        </Col>
        <Col md={11} sm={21} xs={21}>
          <Form.Item label={capitalize(t('form:type-relationship'))}>
            <Input
              value={currentRel}
              onChange={(e) => setCurrentRel(e.target.value)}
            />
            {showErrorRel && (
              <div className="ant-form-item-explain ant-form-item-explain-error">
                <div role="alert">{capitalize(t('form:relationship-required'))}</div>
              </div>
            )}
          </Form.Item>
        </Col>
        <Col md={2} xs={3} sm={3}>
          <div className="shadow-lg flex justify-center items-center p-2 cursor-pointer" onClick={addRelation}>
            <span className="text-sm w-5 h-5 p-2 flex justify-center items-center bg-slate-500 text-white rounded-full">+</span>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {selectedCharacters?.map((rel) => (
          <Col lg={4} md={8} sm={12} xs={24} key={rel.id}>
            <CharacterCard
              removeCharacter={removeCharacter}
              type="add"
              data={rel}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Relatives;
