# Brillouin zone visualisation tool

## One sentence summary

This tool creates pretty 3D pictures which tell you something about how electrons behave in real world solid materials.

## Detailed overview

### What is a lattice?

In many solids, the atoms are arranged in a regular structure, called a lattice. Many different lattice structures are possible.

For example, imagine completely filling space with a load of identically sized, non-overlapping, cubes. If you put an atom at the corner of each cube, you would then have a **Cubic Lattice**.

Now suppose you *also* put an atom at the center of each cube. You would then have a **Body Centred Cubic Lattice (BCC)**.

If you instead added extra atoms in the middle of the faces of each cube, you would have a **Face Centred Cubic Lattice (FCC)**.

Or you might have a completely different sort of lattice. A **hexagonal** lattice consists of two dimensional planes, in layers, each plane filled with identical triangles, with atoms at the corners.

We started by saying that it is the atoms in a solid which are arranged in a regular lattice structure, but really it's only the atomic nuclei which are held in place like this. The electrons are more mobile. But the way they move is influenced by the kind of lattice they are moving through. This tool helps to visualise how a particular lattice structure will affect the way that the electrons move through it.

### How do electrons move through a lattice?

The motion of electrons is governed by quantum mechanics, which describes how nature works at small length scales. It works pretty differently to the "classical" physics we are used to at every day length scales.

For example, in an atom, the electrons can't have just any energy. Their energy is *quantised*, which means that it can only take on certain discrete values, called *energy levels*. When the energy of an electron changes, it must discontinuously jump from one energy level to another. This is different to how things work in classical physics. Planets orbiting the sun can have any energy.

It is also different to how a *free* electron moves in quantum mechanics. If an electron is not bound to an atomic nucleus, then its energy can have any positive value, just like a free particle in classical physics.

When electrons move through a lattice, the situation is like something in between the bound case (with discrete energy levels) and the free case (where any positive energy value is allowed). In a lattice, the energy levels of the individual atoms get smeared out into energy *bands* of the lattice. An energy band corresponds to a range of possible energy values, rather than the single allowed value of an energy level. Electrons in the lattice can take any energy value within a band. However, at the edge of a band, there could be a discrete jump in energy to reach the next band.

The band structure of a lattice is really important for determing the properties of the material. For example, it determines whether a material will be a conductor or an insulator.

### Conductors vs Insulators

There are two important properties of electrons to understand here:

- Electrons are fermions, which means you cannot have more than one of them in the same quantum state.
- Electrons will try to occupy the lowest energy state that they can.

Strictly speaking, the second bullet point is only true when the temperature is sufficiently low. But in most materials, room temperature is already low enough for this heuristic to be valid.

The electrons will occupy the lower energy states first, but they can't all occupy the lowest energy state, so they pile up. Many energy bands will end up containing electrons. Which bands are filled, and how full they are, depends on what the band structure is, and how many electrons there are in total.

Now we are ready to give the crucial distinction between a conductor and an insulator: *in a conductor, the highest energy band is (typically) partially filled, while in an insulator, the highest energy band is (typically) completely filled*.

Why is this?

Consider a wire. Within each electron energy band, there will be some states that correspond to electrons moving right along the wire, and some states that correspond to electrons moving left along the wire. If there is no external electric field being applied, a right-moving state will have the same energy as the corresponding left-moving state. Since electrons fill up the lowest energy states first, this means either both states will be empty, or both will be filled. Overall, there will be no net current in one direction over the other. The two states make equal and opposite contributions which cancel out.

This changes when you apply an electric field to the wire (e.g. by connecting it to a plug socket). Suppose we apply an electric field so that states corresponding to electrons moving right now have a lower energy than the states corresponding to electrons moving left. The electrons will try to rearrange themselves among the available states so that these right-moving states are preferentially filled. If they are able to do that, we will get a net current moving right along the wire.

In a partially filled energy band, this rearrangement is possible, even when an arbitrarily small electric field is applied. There are lots of unoccupied right-moving states within the energy band for the electrons to move into, leaving new vacant left-moving states behind, and giving rise to an overall net current. A material with a partially filled energy band is therefore a *conductor*.

However, if all the energy bands are either fully filled with electrons already, or completely empty, then there is no slack available. No rearrangement of the electrons among the energy states is possible if we only apply a small electric field. This means there will still be no net current overall. We will only see an electric current once we apply an electric field so large that electrons can jump across the gap to a higher energy band. This material is an *insulator*.