import { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Button/Input";
import { Filter } from "@/components/Button/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Button/Item";
import { itemsStorage, ItemStorage } from "@/storage/itemsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.DONE, FilterStatus.PENDING];

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<ItemStorage[]>([]);

  async function handleAdd() {
    if (!description.trim()) {
      return Alert.alert(
        "Adicionar",
        "Informe a descrição do item para adicionar."
      );
    }

    const newItem = {
      id: Math.random().toString(2).substring(2),
      description,
      status: FilterStatus.PENDING,
    };

    await itemsStorage.add(newItem);
    await getItemsByStatus();

    Alert.alert("Adicionado", `Adicionado ${description} com sucesso!`);
    setFilter(FilterStatus.PENDING);
    setDescription("");
  }

  async function getItemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os itens.");
    }
  }

  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id);
      await getItemsByStatus();
      Alert.alert("Removido", "Item removido com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja limpar todos os itens?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          onClear();
        },
      },
    ]);
  }

  async function onClear() {
    try {
      await itemsStorage.clear();
      setItems([]);
      Alert.alert("Limpar", "Todos os itens foram removidos.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover todos os itens.");
    }
  }

  async function handleToggleStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id);
      await getItemsByStatus();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status do item.");
    }
  }

  useEffect(() => {
    getItemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setDescription}
          value={description}
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}
            />
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => handleToggleStatus(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum item aqui.</Text>
          )}
        />
      </View>
    </View>
  );
}
