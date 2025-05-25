/*
 * @(#)JSXTypes.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import { ReactNode } from "react"
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"

export type Props = {
    children: ReactNode,
    style?: ViewStyle | TextStyle | ImageStyle | Array<ViewStyle | TextStyle | ImageStyle>
}