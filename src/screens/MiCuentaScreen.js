import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_EDITAR = 'http://192.168.0.55/salud-api/editar_perfil.php';

export default function MiCuentaScreen({ usuario, setUsuario, cerrarSesion }) {
  const [editando, setEditando] = useState(false);
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [password, setPassword] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const res = await fetch(API_EDITAR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuario.id,
          correo: correo,
          telefono: telefono,
          password: password || undefined
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsuario({ ...usuario, correo: correo, telefono: telefono });
        setEditando(false);
        setPassword('');
        Alert.alert('¡Éxito!', 'Tus datos se actualizaron correctamente.');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetra}>{usuario?.nombre ? usuario.nombre.charAt(0) : 'U'}</Text>
        </View>
        <Text style={styles.nombreUser}>{usuario?.nombre}</Text>
        <View style={styles.dniBadge}>
          <Ionicons name="id-card" size={16} color="#4B5563" />
          <Text style={styles.dniText}>DNI: {usuario?.dni || 'No registrado'} (Inmodificable)</Text>
        </View>
      </View>

      <View style={styles.formBox}>
        <View style={styles.rowTitleEdit}>
          <Text style={styles.sectionTitle}>Mis Datos Personales</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)}>
            <Text style={styles.btnEditarText}>{editando ? 'Cancelar' : '✏️ Editar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput 
          style={[styles.input, !editando && styles.inputDisabled]} 
          value={correo} 
          onChangeText={setCorreo}
          editable={editando}
          keyboardType="email-address"
        />

        <Text style={styles.label}>WhatsApp / Celular:</Text>
        <TextInput 
          style={[styles.input, !editando && styles.inputDisabled]} 
          value={telefono} 
          onChangeText={setTelefono}
          editable={editando}
          keyboardType="phone-pad"
        />

        {editando && (
          <>
            <Text style={styles.label}>Nueva Contraseña (Opcional):</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Escribe para cambiar contraseña" 
              value={password} 
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnGuardarText}>Guardar Cambios</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.btnCerrarSesion} onPress={cerrarSesion}>
        <Text style={styles.btnCerrarSesionText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  cardHeader: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarLetra: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nombreUser: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  dniBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  dniText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  formBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  rowTitleEdit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  btnEditarText: { color: '#3B82F6', fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827' },
  inputDisabled: { backgroundColor: '#F3F4F6', color: '#6B7280' },
  btnGuardar: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  btnGuardarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnCerrarSesion: { paddingVertical: 20, alignItems: 'center', marginTop: 15 },
  btnCerrarSesionText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 }
});