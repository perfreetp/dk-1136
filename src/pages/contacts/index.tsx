import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Contact } from '@/types';
import { getContacts, addContact, deleteContact } from '@/data/teams';
import styles from './index.module.scss';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('队友');

  useDidShow(() => {
    setContacts([...getContacts()]);
  });

  const roleOptions = ['队友', '赛事主办', '裁判', '其他'];

  const handleAddContact = () => {
    if (!newName.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!newPhone.trim()) {
      Taro.showToast({ title: '请输入电话', icon: 'none' });
      return;
    }

    const contact: Contact = {
      id: `c${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      role: newRole
    };

    addContact(contact);
    setContacts([...getContacts()]);
    setShowModal(false);
    setNewName('');
    setNewPhone('');
    setNewRole('队友');
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        Taro.showToast({ title: '拨打电话失败', icon: 'none' });
      }
    });
  };

  const handleCopy = (phone: string) => {
    Taro.setClipboardData({
      data: phone,
      success: () => {
        Taro.showToast({ title: '已复制', icon: 'success' });
      }
    });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除该联系人吗？',
      success: (res) => {
        if (res.confirm) {
          deleteContact(id);
          setContacts([...getContacts()]);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.contactsPage}>
      <View className={styles.header}>
        <Text className={styles.title}>联系方式</Text>
        <View className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Text className={styles.addBtnText}>添加</Text>
        </View>
      </View>

      <View className={styles.contactList}>
        {contacts.map((contact) => (
          <View key={contact.id} className={styles.contactCard}>
            <View className={styles.avatar}>
              <Text className={styles.avatarIcon}>👤</Text>
            </View>
            <View className={styles.info}>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text className={styles.name}>{contact.name}</Text>
                <View className={styles.role}>
                  <Text className={styles.roleText}>{contact.role}</Text>
                </View>
              </View>
              <Text className={styles.phone}>{contact.phone}</Text>
            </View>
            <View className={styles.actions}>
              <View className={styles.actionBtn} onClick={() => handleCall(contact.phone)}>
                <Text className={styles.actionIcon}>📞</Text>
              </View>
              <View className={styles.actionBtn} onClick={() => handleCopy(contact.phone)}>
                <Text className={styles.actionIcon}>📋</Text>
              </View>
              <View className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(contact.id)}>
                <Text className={styles.actionIcon}>🗑️</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>添加联系人</Text>
              <Text className={styles.modalClose} onClick={() => setShowModal(false)}>×</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入姓名"
                value={newName}
                onInput={(e) => setNewName(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>电话</Text>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="请输入电话号码"
                value={newPhone}
                onInput={(e) => setNewPhone(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>身份</Text>
              <View className={styles.roleSelector}>
                {roleOptions.map((role) => (
                  <View
                    key={role}
                    className={`${styles.roleOption} ${newRole === role ? styles.roleOptionActive : ''}`}
                    onClick={() => setNewRole(role)}
                  >
                    <Text className={`${styles.roleTextOption} ${newRole === role ? styles.roleTextOptionActive : ''}`}>
                      {role}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Button className={styles.submitBtn} onClick={handleAddContact}>
              <Text className={styles.submitBtnText}>保存</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default ContactsPage;