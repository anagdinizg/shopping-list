import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { styles } from "./styles";

// Todos os componentes do react-native possuem também um Props, que é um tipo que define as propriedades que o componente aceita.
// Para não precisar desestruturar todas as propriedades do TouchableOpacity, podemos usar o TouchableOpacityProps.
// Isso nos permite herdar todas as propriedades do TouchableOpacity, como onPress, activeOpacity, etc.
// Assim, podemos passar essas propriedades diretamente para o componente Button.
// Usamos o ...rest para pegar todas as outras propriedades que não são title e passá-las para o TouchableOpacity.
type ButtonProps = TouchableOpacityProps & {
  title: string;
};

export function Button({ title, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
