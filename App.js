import React from "react";
import firestore from '@react-native-firebase/firestore';
import {FlatList, View, ScrollView, Text, StyleSheet} from 'react-native';
import {Appbar, TextInput, Button} from 'react-native-paper';
import Todo from './todo';

const AppbarTitle = () => (
  <Text style={{ color: 'white', fontSize: 18 }}>TODOs List</Text>
);

function App() {
  const [todo, setTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [todos, setTodos] = React.useState([]);
  const ref = firestore().collection('todos');
  async function addTodo(){
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }
  React.useEffect(() => { //real time
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);

      if(loading){
        setLoading(false);
      }
    });
  }, []);

  if (loading){
    return null;
  }

  return(
    <View style={{flex:1}}>
      <Appbar style={{ backgroundColor: 'aqua' }}>
        <Appbar.Content title={<AppbarTitle />} />
      </Appbar>
      <FlatList
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item}/>}
      />
      <TextInput
        style={{ backgroundColor: "aqua" }}
        label={<Text style={{ color: 'white' }}>New Todo</Text>}
        value={todo}
        onChangeText={(text) => setTodo(text)}
      />
      <Button textColor="black"  onPress={addTodo}>ADD TODO</Button>
    </View>
  );
}
export default App;