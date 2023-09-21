import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import moment from "moment";
import "./Home.css";
import { useEffect, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../components/useSQLiteDB";
import useConfirmationAlert from "../components/useConfirmationAlert";

type SQLItem = {
  id: number;
  name: string;
  uid: string;
  body: string;
  listId: string;
  datetime: string;
  title: string;
};

const Home: React.FC = () => {
  const [editItem, setEditItem] = useState<any>();
  const [inputName, setInputName] = useState("");
  const [uid, setUId] = useState("");
  const [body, setBody] = useState("");
  const [listId, setListId] = useState("");
  const [datetime, setDateTime] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Array<SQLItem>>();

  const { performSQLAction, initialized } = useSQLiteDB();

  const { showConfirmationAlert, ConfirmationAlert } = useConfirmationAlert();

  const currentTimestamp = moment().format("h:mm");
  const currentDate = moment().format("DD/MM/YYYY");

  useEffect(() => {
    loadData();
  }, [initialized]);

  /**
   * do a select of the database
   */
  const loadData = async () => {
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM test2`);
        setItems(respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const inputData = {
    name: inputName,
    uid: uid,
    body: body,
    listId: listId,
    datetime: currentDate,
    title: currentTimestamp,
  };

  const addItem = async () => {
    try {
      // add test record to db
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(
            `INSERT INTO test2 (id,name,uid,body,listId,datetime,title) values (?,?,?,?,?,?,?);`,
            [Date.now(), inputName, uid, body, listId, currentDate, title]
          );

          console.log(JSON.stringify(inputData));
          // update ui
          const respSelect = await db?.query(`SELECT * FROM test2;`);
          setItems(respSelect?.values);
        },
        async () => {
          setInputName("");
          setUId("");
          setBody("");
          setDateTime("");
          setTitle("");
          setListId("");
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const doEditItem = (item: SQLItem | undefined) => {
    if (item) {
      setEditItem(item);
      setInputName(item.name);
    } else {
      setEditItem(undefined);
      setInputName("");
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      // add test record to db
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(`DELETE FROM test2 WHERE id=?;`, [itemId]);

          // update ui
          const respSelect = await db?.query(`SELECT * FROM test2;`);
          setItems(respSelect?.values);
        },
        async () => {
          setInputName("");
          setUId("");
          setBody("");
          setDateTime("");
          setTitle("");
          setListId("");
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const confirmDelete = (itemId: number) => {
    showConfirmationAlert("Are You Sure You Want To Delete This Item?", () => {
      console.log("This is checking");
      deleteItem(itemId);
    });
  };

  const updateItem = async () => {
    try {
      // add test record to db
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(`UPDATE test2 SET name=? WHERE id=?`, [
            inputName,
            uid,
            body,
            listId,
            title,
            editItem?.id,
          ]);

          // update ui
          const respSelect = await db?.query(`SELECT * FROM test2;`);
          setItems(respSelect?.values);
          console.log("setItems", setItems);
        },
        async () => {
          setInputName("");
          setUId("");
          setBody("");
          setDateTime("");
          setTitle("");
          setListId("");
          setEditItem(undefined);
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic React Sqlite</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {editItem ? (
          <IonItem>
            <IonInput
              type="text"
              placeholder="name"
              value={inputName}
              onIonInput={(e) => setInputName(e.target.value as string)}
            ></IonInput>
            <IonInput
              type="text"
              placeholder="uid"
              value={uid}
              onIonInput={(e) => setUId(e.target.value as string)}
            ></IonInput>
            <IonInput
              type="text"
              placeholder="body"
              value={body}
              onIonInput={(e) => setBody(e.target.value as string)}
            ></IonInput>
            <IonInput
              type="text"
              placeholder="listId"
              value={listId}
              onIonInput={(e) => setListId(e.target.value as string)}
            ></IonInput>
            <IonInput
              type="text"
              placeholder="title"
              value={title}
              onIonInput={(e) => setTitle(e.target.value as string)}
            ></IonInput>
            <IonButton onClick={() => doEditItem(undefined)}>CANCEL</IonButton>
            <IonButton onClick={updateItem}>UPDATE</IonButton>
          </IonItem>
        ) : (
          <>
            <IonGrid>
              <IonRow>
                <IonCol size="4">
                  <IonInput
                    type="text"
                    label="name"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="name"
                    value={inputName}
                    onIonInput={(e) => setInputName(e.target.value as string)}
                  ></IonInput>
                </IonCol>
                <IonCol size="4">
                  <IonInput
                    type="text"
                    label="uid"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="uid"
                    value={uid}
                    onIonInput={(e) => setUId(e.target.value as string)}
                  ></IonInput>
                </IonCol>
                <IonCol size="4">
                  <IonInput
                    type="text"
                    label="body"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="body"
                    value={body}
                    onIonInput={(e) => setBody(e.target.value as string)}
                  ></IonInput>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    type="text"
                    label="listId"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="listId"
                    value={listId}
                    onIonInput={(e) => setListId(e.target.value as string)}
                  ></IonInput>
                </IonCol>
                <IonCol>
                  <IonInput
                    type="text"
                    label="title"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="title"
                    value={title}
                    onIonInput={(e) => setTitle(e.target.value as string)}
                  ></IonInput>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonButtons>
              <IonButton
                fill="solid"
                // expand="block"
                onClick={addItem}
                disabled={inputName.trim() === ""}
              >
                ADD
              </IonButton>
            </IonButtons>
          </>
        )}
        <h3>THE SQLITE DATA</h3>

        {items?.map((item) => (
          <IonItem key={item?.id}>
            <IonLabel className="ion-text-wrap">{item.name}</IonLabel>
            <IonButton onClick={() => doEditItem(item)}>EDIT</IonButton>
            <IonButton onClick={() => confirmDelete(item.id)}>DELETE</IonButton>
          </IonItem>
        ))}

        {ConfirmationAlert}
      </IonContent>
    </IonPage>
  );
};

export default Home;
