import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { useEffect, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../components/useSQLiteDB";
import useConfirmationAlert from "../components/useConfirmationAlert";

type SQLItem = {
  id: number;
  name: string;
};

const Home: React.FC = () => {
  const [editItem, setEditItem] = useState<any>();
  const [inputName, setInputName] = useState("");
  const [items, setItems] = useState<Array<SQLItem>>();

  const { performSQLAction, initialized } = useSQLiteDB();

  const { showConfirmationAlert, ConfirmationAlert } = useConfirmationAlert();

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
        const respSelect = await db?.query(`SELECT * FROM test`);
        setItems(respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const addItem = async () => {
    try {
      // add test record to db
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(`INSERT INTO test (id,name) values (?,?);`, [
            Date.now(),
            inputName,
          ]);

          // update ui
          const respSelect = await db?.query(`SELECT * FROM test;`);
          setItems(respSelect?.values);
        },
        async () => {
          setInputName("");
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
          await db?.query(`DELETE FROM test WHERE id=?;`, [itemId]);

          // update ui
          const respSelect = await db?.query(`SELECT * FROM test;`);
          setItems(respSelect?.values);
        },
        async () => {
          setInputName("");
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
          await db?.query(`UPDATE test SET name=? WHERE id=?`, [
            inputName,
            editItem?.id,
          ]);

          // update ui
          const respSelect = await db?.query(`SELECT * FROM test;`);
          setItems(respSelect?.values);
        },
        async () => {
          setInputName("");
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
              value={inputName}
              onIonInput={(e) => setInputName(e.target.value as string)}
            ></IonInput>
            <IonButton onClick={() => doEditItem(undefined)}>CANCEL</IonButton>
            <IonButton onClick={updateItem}>UPDATE</IonButton>
          </IonItem>
        ) : (
          <IonItem>
            <IonInput
              type="text"
              value={inputName}
              onIonInput={(e) => setInputName(e.target.value as string)}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={addItem}
              disabled={inputName.trim() === ""}
            >
              ADD
            </IonButton>
          </IonItem>
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
