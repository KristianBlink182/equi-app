import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const API_CHAT = 'http://192.168.0.55/salud-api/chat_api.php';

export default function ChatScreen({ volver, seleccionado, usuarioId = 1 }) {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const cantidadAnterior = useRef(0);

  const cargarMensajes = async () => {
    try {
      const res = await fetch(`${API_CHAT}?accion=cargar&paciente_id=${usuarioId}&profesional_id=${seleccionado.id}`);
      const data = await res.json();
      
      // Si hay un mensaje nuevo del doctor, lanzar notificación push
      if (data.length > cantidadAnterior.current && cantidadAnterior.current !== 0) {
        const ultimo = data[data.length - 1];
        if (ultimo.emisor === 'doctor' || ultimo.emisor === 'pro') {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `💬 Nuevo mensaje de ${seleccionado.nombre}`,
              body: ultimo.texto,
              sound: true,
            },
            trigger: null,
          });
        }
      }
      cantidadAnterior.current = data.length;
      setMensajes(data);
    } catch (e) {}
  };

  useEffect(() => {
    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval);
  }, []);

  const enviar = async () => {
    if (!input.trim()) return;
    const textoMensaje = input;
    setInput('');

    try {
      await fetch(`${API_CHAT}?accion=enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente_id: usuarioId,
          profesional_id: seleccionado.id,
          emisor: 'paciente',
          mensaje: textoMensaje
        })
      });
      cargarMensajes();
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Image source={{ uri: seleccionado?.foto_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }} style={styles.avatarChat} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.chatHeaderNombre}>{seleccionado?.nombre}</Text>
          <Text style={styles.chatHeaderEstado}>🟢 Especialista Disponible</Text>
        </View>
      </View>

      {mensajes.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Inicia una conversación con {seleccionado?.nombre}</Text>
        </View>
      ) : (
        <FlatList
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.burbuja, item.emisor === 'paciente' ? styles.burbujaUser : styles.burbujaPro]}>
              <Text style={[styles.texto, item.emisor === 'paciente' && { color: '#fff' }]}>{item.texto}</Text>
              <Text style={[styles.hora, item.emisor === 'paciente' && { color: '#E0E7FF' }]}>{item.hora}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Escribe tu mensaje..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.btnEnviar} onPress={enviar}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  avatarChat: { width: 36, height: 36, borderRadius: 18, marginLeft: 8 },
  chatHeaderNombre: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  chatHeaderEstado: { fontSize: 11, color: '#10B981' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  burbuja: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  burbujaUser: { alignSelf: 'flex-end', backgroundColor: '#3B82F6', borderBottomRightRadius: 2 },
  burbujaPro: { alignSelf: 'flex-start', backgroundColor: '#E5E7EB', borderBottomLeftRadius: 2 },
  texto: { fontSize: 14, color: '#1F2937' },
  hora: { fontSize: 10, color: '#6B7280', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', gap: 8 },
  input: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, fontSize: 14 },
  btnEnviar: { backgroundColor: '#3B82F6', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});